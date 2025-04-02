import json
import os
from main import app
from mangum import Mangum
from config import logger, ENVIRONMENT, API_STAGE

# Create Mangum handler with appropriate configuration
lambda_handler = Mangum(
    app,
    lifespan="off",
    api_gateway_base_path=API_STAGE if ENVIRONMENT != "development" else None
)

# Log Lambda function initialization
logger.info(f"Lambda function initialized in {ENVIRONMENT} environment, API stage: {API_STAGE}")

# Export the handler for AWS Lambda
__all__ = ['lambda_handler']
