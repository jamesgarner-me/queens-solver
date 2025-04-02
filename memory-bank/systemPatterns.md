# System Patterns: Queens Solver

## System Architecture

The Queens Solver application follows a client-server architecture with clear separation of concerns and environment-specific configurations (only development (local) and production):

```mermaid
graph LR
    subgraph Frontend
        UI[React/TS UI]
        S3[S3 Bucket]
        CF[CloudFront]
        EnvConfig[Environment Config\n(Dev/Prod)]
    end
    
    subgraph Backend
        API[API Gateway]
        Stages[API Stages\n(Dev/Prod)]
        Lambda[Python Lambda]
        EnvVars[Environment Variables]
    end
    
    subgraph External
        LinkedIn[LinkedIn API]
    end
    
    UI --> CF
    CF --> S3
    UI --> EnvConfig
    EnvConfig --> API
    API --> Stages
    Stages --> Lambda
    Lambda --> EnvVars
    Lambda --> LinkedIn
```

### Key Components

1. **Frontend (React/TypeScript)**
   - User interface for displaying puzzles and solutions
   - Communicates with backend via RESTful API
   - Handles rendering of game boards and solutions
   - Deployed to AWS S3 and served via CloudFront

2. **Backend (Python/Lambda)**
   - Fetches puzzle data from LinkedIn's API
   - Processes and transforms puzzle data
   - Implements solving algorithms
   - Exposes RESTful API endpoints via API Gateway
   - Deployed as AWS Lambda function

3. **Infrastructure**
   - **Infrastructure as Code**: AWS CloudFormation templates are used (explicitly NOT using SAM)
   - **Deployment Automation**: GitHub workflows (backend-ci and frontend-ci) handle CI/CD pipelines
   - **CloudFront**: Content delivery network for frontend assets
   - **S3**: Static hosting for frontend application
   - **API Gateway**: RESTful API endpoint management
   - **Lambda**: Serverless function execution
   - **External Services**: LinkedIn API integration

## Key Technical Decisions

1. **Backend Technology: Python with AWS Lambda**
   - **Rationale**: Serverless architecture for cost-efficiency and scalability
   - **Benefits**: 
     - No server management
     - Pay-per-use pricing
     - Automatic scaling
     - Integration with AWS services
   - **Trade-offs**: 
     - Cold start latency
     - Execution time limits
     - Stateless architecture requirements

2. **Frontend Technology: React with TypeScript**
   - **Rationale**: Strong typing for complex game state management
   - **Benefits**: 
     - Component reusability
     - Type safety
     - Modern development experience
   - **Trade-offs**: 
     - Additional build complexity
     - Learning curve

3. **API Communication: RESTful JSON via API Gateway**
   - **Rationale**: Simplicity and wide compatibility
   - **Benefits**: 
     - Easy debugging
     - Familiar pattern
     - Built-in security features
     - Request/response validation
   - **Trade-offs**: 
     - Less efficient than binary protocols
     - Additional latency from API Gateway

4. **Solving Algorithm: Backtracking**
   - **Rationale**: Well-suited for constraint satisfaction problems
   - **Benefits**: 
     - Guaranteed solution finding
     - Memory efficient
   - **Trade-offs**: 
     - Potentially slower for large boards
     - Lambda timeout considerations

5. **Deployment Architecture: AWS Serverless with GitHub CI/CD**
   - **Environments**:
     - Development: Local environment, not on AWS
     - Production: Deployed on AWS
     - No staging or other intermediate environments (personal project)
   - **Frontend**:
     - S3 for static hosting (production only)
     - CloudFront for content delivery (production only)
     - Environment-based configuration
     - Deployed via GitHub frontend-ci workflow
   - **Backend**:
     - Lambda for serverless execution (production only)
     - API Gateway for HTTP endpoints (production only)
     - CloudWatch for monitoring (production only)
     - Local FastAPI server for development
     - Deployed via GitHub backend-ci workflow
   - **Infrastructure Provisioning**:
     - CloudFormation templates (explicitly NOT using SAM)
     - Automated deployment through GitHub workflows
   - **Benefits**:
     - Scalable infrastructure
     - Cost-effective
     - Managed services
     - Automated deployment pipeline
   - **Trade-offs**:
     - Vendor lock-in
     - Cold starts
     - Stateless design requirements

## Design Patterns

1. **Service Pattern**
   - **Implementation**: Separate service modules for API interaction and game solving
   - **Purpose**: Separation of concerns, maintainability
   - **Example**: `api_service.py` and `game_service.py`

2. **Repository Pattern**
   - **Implementation**: Abstraction layer for data access
   - **Purpose**: Isolate data access logic, facilitate testing
   - **Example**: API service abstracting LinkedIn data access

3. **Strategy Pattern**
   - **Implementation**: Pluggable solving algorithms
   - **Purpose**: Allow different solving strategies without changing client code
   - **Example**: Board solver implementation

4. **Component Pattern (Frontend)**
   - **Implementation**: Reusable UI components
   - **Purpose**: Consistency, reusability, maintainability
   - **Example**: Gameboard, Button, Modal components

5. **Context Provider Pattern (Frontend)**
   - **Implementation**: React context for state management
   - **Purpose**: Avoid prop drilling, centralize state
   - **Example**: ModalContext for managing modal state

## Component Relationships

### AWS Infrastructure & Deployment

```mermaid
graph TD
    subgraph "CI/CD"
        GH[GitHub Repository]
        FECI[frontend-ci Workflow]
        BECI[backend-ci Workflow]
        CFN[CloudFormation Templates]
    end
    
    subgraph Frontend
        UI[React/TS UI]
        S3[S3 Bucket]
        CF[CloudFront]
    end
    
    subgraph Backend
        API[API Gateway]
        Lambda[Python Lambda]
        CW[CloudWatch]
    end
    
    subgraph External
        LinkedIn[LinkedIn API]
    end
    
    GH --> FECI
    GH --> BECI
    FECI --> CFN
    BECI --> CFN
    CFN --> S3
    CFN --> Lambda
    CFN --> API
    UI --> CF
    CF --> S3
    UI --> API
    API --> Lambda
    Lambda --> CW
    Lambda --> LinkedIn
```

### Backend Components

```mermaid
graph TD
    API[API Gateway] --> Lambda[Lambda Function]
    Lambda --> Game[Game Service]
    Game --> Solver[Board Solver]
    Game --> APIService[API Service]
    APIService --> LinkedIn[LinkedIn API]
```

### Frontend Components

```mermaid
graph TD
    App[App.tsx] --> Layout[MainLayout]
    Layout --> Game[GamePage]
    Game --> Board[Gameboard]
    Board --> UI[UI Components]
    UI --> Button[Button]
    UI --> Modal[Modal]
```

## Critical Implementation Paths

1. **Puzzle Retrieval Flow**
   ```
   API Gateway → Lambda → Game Service → API Service → LinkedIn API → Parse Response → Return Data
   ```

2. **Puzzle Solving Flow**
   ```
   Lambda → Game Service → Extract Board Data → Board Solver → Backtracking Algorithm → Return Solution
   ```

3. **Frontend Rendering Flow**
   ```
   CloudFront → S3 → React App → API Call → Update State → Render Gameboard → Display Solution
   ```

4. **Error Handling Path**
   ```
   Try API Call → Catch Exception → Format Error → Return Error Response → Display Error UI
   ```

## Data Flow

1. **Backend to LinkedIn**
   - Authentication request with CSRF token
   - GraphQL query to fetch puzzle data
   - Response parsing and transformation

2. **Backend to Frontend**
   - JSON response with:
     - Original board configuration
     - Board size
     - Puzzle ID
     - Solution coordinates

3. **Within Frontend**
   - API service fetches data from backend
   - Game state management via hooks
   - Component rendering based on state
   - User interaction handling

## Security Considerations

1. **API Authentication**
   - LinkedIn session cookies for API access
   - No sensitive user data stored
   - API Gateway request validation
   - Lambda execution role permissions

2. **Error Handling**
   - Sanitized error messages to prevent information leakage
   - Graceful degradation on API failures
   - CloudWatch logging and monitoring

3. **Input Validation**
   - Type checking via TypeScript (frontend) and Pydantic (backend)
   - Validation of API responses before processing
   - API Gateway request validation

4. **Infrastructure Security**
   - CloudFront SSL/TLS encryption
   - S3 bucket policies
   - API Gateway authentication
   - Lambda execution role permissions
