# Technical Context: Queens Solver

## Technologies Used

### Backend

1. **Python 3.13**
   - Core programming language for backend services
   - Chosen for readability and strong algorithm implementation capabilities

2. **FastAPI**
   - Modern, high-performance web framework
   - Automatic OpenAPI documentation
   - Built-in request validation via Pydantic
   - Asynchronous request handling

3. **Mangum**
   - Adapter for running FastAPI applications on AWS Lambda
   - Enables serverless deployment

4. **Requests**
   - HTTP library for making API calls to LinkedIn
   - Handles session management and cookies

### Frontend

1. **TypeScript**
   - Statically typed superset of JavaScript
   - Provides type safety and better developer experience

2. **React**
   - Component-based UI library
   - Virtual DOM for efficient rendering
   - Hooks for state management

3. **Vite**
   - Modern build tool and development server
   - Fast hot module replacement
   - Optimized production builds

4. **CSS Modules**
   - Component-scoped CSS
   - Prevents style leakage between components

### Infrastructure

1. **AWS Lambda**
   - Serverless compute service
   - Pay-per-use pricing model
   - Automatic scaling

2. **AWS API Gateway**
   - API management and routing
   - Request/response transformation
   - API key management

## Development Setup

### Local Environment Requirements

1. **Node.js (v18+)**
   - Required for frontend development
   - Package management via npm

2. **Python 3.13**
   - Required for backend development
   - Virtual environment management

3. **Git**
   - Version control
   - Branch management for feature development

### Development Workflow

1. **Backend Development**
   ```bash
   # Setup virtual environment
   python -m venv myenv
   source myenv/bin/activate  # On Windows: myenv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Run development server
   cd backend
   uvicorn src.main:app --reload
   ```

2. **Frontend Development**
   ```bash
   # Install dependencies
   cd frontend
   npm install
   
   # Run development server
   npm run dev
   ```

3. **Testing**
   ```bash
   # Backend tests
   cd backend
   python -m pytest
   
   # Frontend tests
   cd frontend
   npm test
   ```

### Deployment Process

1. **Environment Strategy**
   - Three environments:
     - Development: Local environment, not on AWS
     - Production: Deployed on AWS for end users
   - Each environment has its own configuration

2. **Deployment Automation**
   - GitHub Actions workflows handle CI/CD:
     - backend-ci: Deploys backend to AWS
     - frontend-ci: Deploys frontend to AWS

3. **Backend Deployment**
   ```bash
   # Local development
   cd backend
   uvicorn src.main:app --reload
   
   # Production deployment is handled by GitHub workflow
   # Uses CloudFormation (NOT SAM) for infrastructure
   # Deploys to API Gateway and Lambda with appropriate stage
   ```

4. **Frontend Deployment**
   ```bash
   # Local development
   cd frontend
   npm run dev
   
   # Production build
   npm run build:production
   
   # Deployment is handled by GitHub workflow
   # Deploys to S3 and configures CloudFront
   # Environment variables are injected during build
   ```

## Technical Constraints

1. **LinkedIn API Limitations**
   - No official public API for puzzles
   - Reliance on undocumented GraphQL endpoints
   - Potential for breaking changes without notice
   - Authentication requirements via cookies/tokens

2. **AWS Lambda Constraints**
   - Maximum execution time of 15 minutes
   - 512 MB /tmp directory storage
   - Deployment package size limits
   - Cold start latency

3. **Browser Compatibility**
   - Support for modern browsers (Chrome, Firefox, Safari, Edge)
   - No support for IE11 or older browsers
   - Responsive design constraints for mobile devices

4. **Performance Requirements**
   - Solution generation in under 5 seconds
   - Frontend rendering performance on lower-end devices
   - API response times under 1 second

## Dependencies

### Backend Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| fastapi | 0.115.7 | Web framework |
| uvicorn | 0.34.0 | ASGI server |
| mangum | 0.19.0 | AWS Lambda adapter |
| requests | 2.32.3 | HTTP client |
| pydantic | 2.10.6 | Data validation |

### Frontend Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| react | ^18.2.0 | UI library |
| typescript | ^5.0.0 | Type checking |
| vite | ^4.0.0 | Build tool |
| vitest | ^0.34.0 | Testing framework |

## Tool Usage Patterns

### Code Organization

1. **Backend Structure**
   ```
   backend/
   ├── src/
   │   ├── __init__.py
   │   ├── main.py           # FastAPI application entry point
   │   ├── config.py         # Configuration settings
   │   ├── lambda_function.py # AWS Lambda handler
   │   ├── services/         # Business logic services
   │   │   ├── __init__.py
   │   │   ├── api_service.py # LinkedIn API interaction
   │   │   └── game_service.py # Game logic
   │   └── utils/            # Utility functions
   │       ├── __init__.py
   │       └── board_solver.py # N-Queens solver
   ├── tests/                # Test files
   └── requirements.txt      # Dependencies
   ```

2. **Frontend Structure**
   ```
   frontend/
   ├── src/
   │   ├── main.tsx          # Application entry point
   │   ├── App.tsx           # Root component
   │   ├── config.ts         # Configuration settings
   │   ├── components/       # Reusable UI components
   │   │   ├── game/         # Game-specific components
   │   │   └── ui/           # Generic UI components
   │   ├── services/         # API services
   │   ├── hooks/            # Custom React hooks
   │   ├── context/          # React context providers
   │   ├── types/            # TypeScript type definitions
   │   └── utils/            # Utility functions
   ├── public/               # Static assets
   └── package.json          # Dependencies and scripts
   ```

### Development Practices

1. **Type Safety**
   - TypeScript interfaces for all data structures
   - Pydantic models for API request/response validation
   - Strict type checking configuration

2. **Testing Strategy**
   - Unit tests for utility functions and services
   - Component tests for React components
   - Integration tests for API endpoints
   - Manual testing for UI/UX flows

3. **Error Handling**
   - Centralized error handling in API services
   - Graceful degradation in UI components
   - Detailed logging for debugging
   - User-friendly error messages

4. **State Management**
   - React hooks for component-level state
   - Context API for application-wide state
   - Prop drilling minimization

5. **Code Style**
   - ESLint and Prettier for JavaScript/TypeScript
   - Black and isort for Python
   - Consistent naming conventions
   - Documentation for complex functions
