import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from config import ALLOWED_ORIGINS, ENVIRONMENT, API_STAGE, logger
from services.game_service import get_latest_game

# Configure FastAPI app with environment-specific settings
app = FastAPI(
    title="Queens Solver API",
    description="API for solving LinkedIn Queens puzzles",
    version="1.0.0",
    root_path=f"/{API_STAGE}" if ENVIRONMENT != "development" else ""
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

@app.get("/")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "environment": ENVIRONMENT, "stage": API_STAGE}

@app.get("/boards/latest")
def get_game():
    """API endpoint to return the latest game"""
    logger.info("Fetching latest game")
    return get_latest_game()

# Wrap FastAPI app for AWS Lambda compatibility
handler = Mangum(app)
