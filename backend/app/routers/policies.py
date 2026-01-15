from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import get_supabase
from typing import List

router = APIRouter()

class PolicyUpdate(BaseModel):
    max_tx_amount: float | None = None
    monthly_budget: float | None = None
    allow_list: List[str] | None = None
    block_list: List[str] | None = None

@router.get("/policy")
async def get_policy():
    """
    Get current policy
    """
    supabase = get_supabase()
    
    try:
        response = supabase.table('policies').select('*').order('created_at', desc=True).limit(1).execute()
        
        if not response.data:
            # Create default policy
            default_policy = {
                'max_tx_amount': 1000,
                'monthly_budget': 5000,
                'current_monthly_spent': 0,
                'required_approval_threshold': 500,
                'allow_list': ['Stripe', 'Circle', 'Amazon'],
                'block_list': []
            }
            
            create_response = supabase.table('policies').insert(default_policy).execute()
            return create_response.data[0] if create_response.data else default_policy
        
        return response.data[0]
        
    except Exception as e:
        print(f"Error fetching policy: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/policy")
async def update_policy(policy_update: PolicyUpdate):
    """
    Update policy
    """
    supabase = get_supabase()
    
    try:
        # Get current policy
        response = supabase.table('policies').select('*').order('created_at', desc=True).limit(1).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Policy not found")
        
        current_policy = response.data[0]
        
        # Prepare updates
        updates = {}
        if policy_update.max_tx_amount is not None:
            updates['max_tx_amount'] = policy_update.max_tx_amount
        if policy_update.monthly_budget is not None:
            updates['monthly_budget'] = policy_update.monthly_budget
        if policy_update.allow_list is not None:
            updates['allow_list'] = policy_update.allow_list
        if policy_update.block_list is not None:
            updates['block_list'] = policy_update.block_list
        
        # Update policy
        update_response = supabase.table('policies').update(updates).eq('id', current_policy['id']).execute()
        
        return update_response.data[0] if update_response.data else current_policy
        
    except Exception as e:
        print(f"Error updating policy: {e}")
        raise HTTPException(status_code=500, detail=str(e))
