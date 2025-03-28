import os

# Get allowed origins from environment variable or use default for development
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")  # Default for local development

# Base URLs
GAME_BASE_URL = "https://www.linkedin.com/games/view/queens/desktop/"
API_BASE_URL = "https://www.linkedin.com/voyager/api/graphql"

# LinkedIn API Query
QUERY_STRING = "?includeWebMetadata=true&variables=(gameTypeId:3)&queryId=voyagerIdentityDashGames.3f8521c6cb0e550ebd391b373caa11fb"

# Logging configuration
LOG_FORMAT = "%(asctime)s - %(levelname)s - %(message)s"
LOG_LEVEL = "DEBUG"
