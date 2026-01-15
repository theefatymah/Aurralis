from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Supabase
    supabase_url: str
    supabase_key: str
    supabase_service_key: str
    
    # Gemini API  
    gemini_api_key: str
    
    # Circle API
    circle_api_key: str
    circle_base_url: str = "https://api-sandbox.circle.com"
    
    # App Config
    app_env: str = "development"
    cors_origins: List[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
