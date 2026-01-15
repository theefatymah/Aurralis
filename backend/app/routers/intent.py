from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import get_supabase
from app.services.intent_processor import intent_processor
from app.services.policy_validator import policy_validator
from app.services.circle_wrapper import circle_wrapper
from app.services.proof_generator import proof_generator
import asyncio

router = APIRouter()

class IntentRequest(BaseModel):
    query: str

class ApproveRequest(BaseModel):
    activity_id: str

@router.post("/intent")
async def process_intent(request: IntentRequest):
    """
    Process user query and create agent activity
    """
    supabase = get_supabase()
    
    try:
        # 1. Fetch current policy
        policy_response = supabase.table('policies').select('*').order('created_at', desc=True).limit(1).execute()
        if not policy_response.data:
            raise HTTPException(status_code=404, detail="Policy not found")
        
        policy = policy_response.data[0]
        
        # 2. Process intent with Gemini
        intent_data = await intent_processor.process_query(request.query, policy)
        
        if not intent_data or not intent_data.get('amount'):
            return {
                "message": "I'd be happy to help! Please specify an amount and recipient. For example: 'Send $100 to Stripe'",
                "is_transaction": False
            }
        
        # 3. Validate against policy
        validation = policy_validator.validate(intent_data, policy)
        status = policy_validator.determine_status(validation['is_valid'])
        
        # 4. Create agent_activity record
        activity_data = {
            "user_query": request.query,
            "structured_intent": intent_data,
            "ai_reasoning": intent_data.get('reasoning', ''),
            "status": status,
            "policy_checks": validation['policy_checks']
        }
        
        activity_response = supabase.table('agent_activities').insert(activity_data).execute()
        
        if not activity_response.data:
            raise HTTPException(status_code=500, detail="Failed to create activity")
        
        activity = activity_response.data[0]
        
        # 5. Return decision card data
        return {
            "activity_id": activity['id'],
            "structured_intent": intent_data,
            "ai_reasoning": intent_data.get('reasoning', ''),
            "policy_checks": validation['policy_checks'],
            "status": status,
            "is_valid": validation['is_valid'],
            "violations": validation.get('violations', [])
        }
        
    except Exception as e:
        print(f"Error processing intent: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/approve/{activity_id}")
async def approve_transaction(activity_id: str):
    """
    Approve and execute transaction
    """
    supabase = get_supabase()
    
    try:
        # 1. Get activity
        activity_response = supabase.table('agent_activities').select('*').eq('id', activity_id).single().execute()
        
        if not activity_response.data:
            raise HTTPException(status_code=404, detail="Activity not found")
        
        activity = activity_response.data
        
        # 2. Check state lock
        if activity.get('locked'):
            raise HTTPException(status_code=409, detail="Transaction already being processed")
        
        # 3. Check status
        if activity['status'] not in ['pending_approval', 'flagged_by_policy']:
            raise HTTPException(status_code=400, detail=f"Cannot approve transaction in status: {activity['status']}")
        
        # 4. Set lock
        supabase.table('agent_activities').update({
            'locked': True,
            'locked_at': 'now()',
            'status': 'executing'
        }).eq('id', activity_id).execute()
        
        # 5. Re-validate policy
        policy_response = supabase.table('policies').select('*').order('created_at', desc=True).limit(1).execute()
        policy = policy_response.data[0] if policy_response.data else None
        
        if policy:
            intent = activity['structured_intent']
            validation = policy_validator.validate(intent, policy)
            
            if not validation['is_valid']:
                # Update status to flagged
                supabase.table('agent_activities').update({
                    'status': 'flagged_by_policy',
                    'locked': False
                }).eq('id', activity_id).execute()
                
                raise HTTPException(status_code=403, detail=validation['violations'][0])
        
        # 6. Execute via Circle
        intent = activity['structured_intent']
        transfer_result = await circle_wrapper.transfer_with_timeout(
            amount=intent['amount'],
            recipient=intent['recipient'],
            timeout=30
        )
        
        # 7. Create transaction record
        transaction_data = {
            'activity_id': activity_id,
            'tx_hash': transfer_result['tx_hash'],
            'explorer_url': proof_generator.generate_explorer_url(transfer_result['tx_hash']),
            'amount': intent['amount'],
            'currency': intent.get('currency', 'USDC'),
            'recipient': intent['recipient'],
            'status': transfer_result['status'],
            'confirmations': 0
        }
        
        tx_response = supabase.table('transactions').insert(transaction_data).execute()
        
        # 8. Update activity status
        final_status = 'executed' if transfer_result['status'] == 'confirmed' else 'executing'
        supabase.table('agent_activities').update({
            'status': final_status,
            'locked': False
        }).eq('id', activity_id).execute()
        
        # 9. Update policy spending
        if policy:
            new_spent = float(policy.get('current_monthly_spent', 0)) + intent['amount']
            supabase.table('policies').update({
                'current_monthly_spent': new_spent
            }).eq('id', policy['id']).execute()
        
        # 10. Return proof data
        return {
            "activity_id": activity_id,
            "tx_hash": transfer_result['tx_hash'],
            "explorer_url": proof_generator.generate_explorer_url(transfer_result['tx_hash']),
            "status": transfer_result['status'],
            "proof_data": proof_generator.generate_proof_data(
                transfer_result['tx_hash'],
                intent['amount'],
                intent['recipient']
            )
        }
        
    except HTTPException:
        raise
    except Exception as e:
        # Release lock on error
        supabase.table('agent_activities').update({
            'status': 'failed',
            'locked': False
        }).eq('id', activity_id).execute()
        
        print(f"Error approving transaction: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/deny/{activity_id}")
async def deny_transaction(activity_id: str):
    """
    Deny transaction
    """
    supabase = get_supabase()
    
    try:
        # Update activity status
        response = supabase.table('agent_activities').update({
            'status': 'rejected'
        }).eq('id', activity_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Activity not found")
        
        return {"message": "Transaction denied", "activity_id": activity_id}
        
    except Exception as e:
        print(f"Error denying transaction: {e}")
        raise HTTPException(status_code=500, detail=str(e))
