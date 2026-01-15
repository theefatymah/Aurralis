from fastapi import APIRouter, HTTPException
from app.database import get_supabase

router = APIRouter()

@router.get("/activities")
async def get_activities():
    """
    Get all agent activities with transactions
    """
    supabase = get_supabase()
    
    try:
        response = supabase.table('agent_activities').select('''
            *,
            transactions (*)
        ''').order('created_at', desc=True).execute()
        
        return {"activities": response.data}
        
    except Exception as e:
        print(f"Error fetching activities: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/activities/{activity_id}")
async def get_activity(activity_id: str):
    """
    Get specific activity
    """
    supabase = get_supabase()
    
    try:
        response = supabase.table('agent_activities').select('''
            *,
            transactions (*)
        ''').eq('id', activity_id).single().execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Activity not found")
        
        return response.data
        
    except Exception as e:
        print(f"Error fetching activity: {e}")
        raise HTTPException(status_code=500, detail=str(e))
