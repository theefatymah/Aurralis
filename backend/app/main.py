from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import intent, activities, policies

app = FastAPI(
    title="Aurralis API",
    description="AI-powered transaction assistant with policy enforcement",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(intent.router, prefix="/api", tags=["intent"])
app.include_router(activities.router, prefix="/api", tags=["activities"])
app.include_router(policies.router, prefix="/api", tags=["policies"])

@app.get("/")
async def root():
    return {
        "message": "Aurralis API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
