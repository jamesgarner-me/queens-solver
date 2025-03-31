from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from config import ALLOWED_ORIGINS
from services.game_service import get_latest_game

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/boards/latest")
def get_game():
    """API endpoint to return the game"""
    return get_latest_game()


# Wrap FastAPI app for AWS Lambda compatibility
handler = Mangum(app)
