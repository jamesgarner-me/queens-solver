# AWS API Gateway Integration

This document outlines the implementation of AWS API Gateway for the Queens Solver application, explaining how it's configured and how to work with it in different environments.

## Overview

The Queens Solver application uses AWS API Gateway to route API requests between the frontend and backend Lambda function. The implementation supports:

1. Multiple deployment stages (dev, prod)
2. Environment-specific configurations
3. Local development without AWS dependencies
4. Proper CORS handling for cross-origin requests

## Architecture

```
Frontend (React/TS) ──> API Gateway ──> Lambda Function ──> LinkedIn API
                         │
                         ▼
                     CloudFront
```

- **Frontend**: React/TypeScript application that makes API requests to fetch puzzle data
- **API Gateway**: Routes API requests to the appropriate Lambda function based on the stage
- **Lambda Function**: Processes requests, fetches data from LinkedIn, and returns solutions
- **CloudFront**: CDN for frontend assets and API Gateway integration

## Environment Configuration

### Backend

The backend supports different environments through environment variables:

- `ENVIRONMENT`: The current environment (development, prod)
- `API_STAGE`: The API Gateway stage (dev, prod)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS
- `LOG_LEVEL`: Logging level (DEBUG, INFO, WARNING, ERROR)

These variables are set in the CloudFormation template for AWS deployments and can be set locally for development.

### Frontend

The frontend uses environment-specific configuration files:

- `.env.development`: Local development configuration
- `.env.production`: Production environment configuration

Each file contains:
- `VITE_API_BASE_URL`: The base URL for API requests
- `VITE_ENV`: The current environment name

## Local Development

For local development:

1. Start the backend server:
   ```bash
   cd backend
   python -m venv myenv
   source myenv/bin/activate  # On Windows: myenv\Scripts\activate
   pip install -r requirements.txt
   uvicorn src.main:app --reload
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The frontend will use the API URL from `.env.development` (http://localhost:8000 by default).

## AWS Deployment

The application is deployed to AWS using CloudFormation templates:

1. **Backend Deployment**:
   - Lambda function with API Gateway integration
   - API Gateway with multiple stages (dev, prod)
   - CloudWatch for logging and monitoring

2. **Frontend Deployment**:
   - S3 bucket for static hosting
   - CloudFront distribution for content delivery
   - Environment-specific builds

## API Gateway Configuration

The API Gateway is configured with:

1. **Stages**: Separate stages for different environments (dev, prod)
2. **Resources**:
   - `/`: Root endpoint (health check)
   - `/boards/latest`: Endpoint to fetch the latest puzzle and solution
3. **Methods**:
   - `GET`: For retrieving data
   - `OPTIONS`: For CORS preflight requests
4. **CORS**: Configured to allow cross-origin requests from the frontend

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Check that the `ALLOWED_ORIGINS` environment variable includes your frontend URL
   - Verify that the API Gateway has CORS configured correctly
   - Ensure the frontend is using the correct API URL

2. **API Gateway 5xx Errors**:
   - Check CloudWatch logs for Lambda function errors
   - Verify that the Lambda function has the correct permissions
   - Check that the API Gateway integration is configured correctly

3. **Local Development Issues**:
   - Ensure the backend server is running on the expected port
   - Verify that the frontend is using the correct API URL
   - Check for any network or firewall issues

### Logs

- **Backend Logs**: Available in CloudWatch Logs for AWS deployments or in the terminal for local development
- **Frontend Logs**: Available in the browser console

## Environment Variables

When deploying to AWS, the following environment variables need to be replaced with actual values:

- In `.env.production`:
  - `${API_GATEWAY_ID}`: The API Gateway ID (e.g., abc123def)
  - `${AWS_REGION}`: The AWS region (e.g., us-east-1)

These values are typically provided as outputs from the CloudFormation stack.
