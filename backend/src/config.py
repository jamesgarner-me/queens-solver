import os
import logging

# Environment configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
API_STAGE = os.getenv("API_STAGE", "dev")

# Get allowed origins from environment variable or use default for development
DEFAULT_ORIGINS = "http://localhost:5173" if ENVIRONMENT == "development" else "*"
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",")

# Base URLs
GAME_BASE_URL = "https://www.linkedin.com/games/view/queens/desktop/"
API_BASE_URL = "https://www.linkedin.com/voyager/api/graphql"

# LinkedIn API Query
QUERY_STRING = "?includeWebMetadata=true&variables=(gameTypeId:3)&queryId=voyagerIdentityDashGames.3f8521c6cb0e550ebd391b373caa11fb"

# Logging configuration
LOG_FORMAT = "%(asctime)s - %(levelname)s - %(message)s"
LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG")

# Configure logging
logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format=LOG_FORMAT
)
logger = logging.getLogger(__name__)

# Log environment information at startup
logger.info(f"Starting application in {ENVIRONMENT} environment")
logger.info(f"API Stage: {API_STAGE}")
logger.info(f"Allowed origins: {ALLOWED_ORIGINS}")
