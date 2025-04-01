import json
from main import app
from mangum import Mangum

# Create Mangum handler
lambda_handler = Mangum(app, lifespan="off")

# Export the handler for AWS Lambda
__all__ = ['lambda_handler'] 