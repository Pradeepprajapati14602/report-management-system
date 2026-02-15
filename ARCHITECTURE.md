# System Architecture

This document provides a brief overview of the Report Management System architecture.

## Architecture Overview

The application follows a **three-tier architecture** with clear separation of concerns:

1. **Frontend (Presentation Layer)** - React SPA consuming REST APIs
2. **Backend (Business Logic Layer)** - Spring Boot REST APIs
3. **Database (Data Layer)** - PostgreSQL with JPA/Hibernate

## Frontend Architecture

The React frontend uses a **component-based architecture** with:

- **Functional Components** with Hooks for state management
- **React Context** for global authentication state
- **React Router** for client-side routing and protected routes
- **Axios** with interceptors for API communication and JWT token handling
- **Service Layer** (`services/`) that encapsulates API calls

Key design decisions:
- Context API for authentication state (no Redux needed for this scope)
- Protected routes that redirect unauthenticated users to login
- Centralized error handling in API interceptors
- Route-based code splitting with React Router lazy loading

## Backend Architecture

The Spring Boot backend follows **layered architecture** with clear separation:

```
Controller (REST endpoints)
    ↓
Service (Business logic)
    ↓
Repository (Data access via JPA)
    ↓
Database (PostgreSQL)
```

### Key Components:

- **Controllers** - Handle HTTP requests, validation, and responses
- **Services** - Contain business logic and orchestrate operations
- **Repositories** - JPA interfaces for database operations
- **DTOs** - Data Transfer Objects for API contracts
- **Entity Models** - JPA entities mapped to database tables
- **Security** - JWT-based stateless authentication with BCrypt encryption

### Security Flow:

1. User logs in → `AuthController` validates credentials
2. `AuthenticationService` uses Spring Security's `AuthenticationManager`
3. On success, JWT token generated and returned to client
4. Client stores token and sends it in `Authorization: Bearer <token>` header
5. `JwtAuthenticationFilter` validates token on each protected request
6. `CustomUserDetailsService` loads user details from database

## Database Design

### Schema:

**Users Table:** Stores authentication credentials and user roles
- Primary key: id (auto-increment)
- Unique constraint on email
- BCrypt encrypted passwords
- Role-based access (USER, ADMIN)

**Reports Table:** Stores medical report metadata
- Foreign key to users (cascade delete)
- Status tracking (UPLOADED, PROCESSING, COMPLETED)
- File path, type, and report date
- Optional summary for completed reports

### Database Migrations:

- **Flyway** for version-controlled migrations
- Automatic migration on application startup
- Migration files in `src/main/resources/db/migration/`
- Naming convention: `V{VERSION}__{DESCRIPTION}.sql`

## API Design

RESTful API design following these principles:

- **Resource-based URLs** (`/reports`, `/users`)
- **HTTP methods** for operations (GET, POST, PATCH, DELETE)
- **Standard HTTP status codes** (200, 201, 400, 401, 403, 404, 500)
- **Consistent response format** with `ApiResponse<T>` wrapper
- **Global exception handler** for centralized error handling
- **DTO validation** using Jakarta Bean Validation

## File Upload Handling

File uploads use `multipart/form-data` encoding:
- Frontend uses FormData API
- Backend uses `@RequestParam MultipartFile file`
- Files are stored with generated unique names
- File path saved in database for retrieval

## Frontend State Management

State is managed at appropriate levels:
- **Local state** (useState) for component-specific data
- **Context state** for authentication (user, token, login/logout)
- **URL state** (React Router) for navigation and location
- **No additional state management libraries** needed for this scope

## CORS Configuration

CORS is configured to allow frontend-backend communication:
- Allowed origins: `http://localhost:3000`, `http://localhost:5173`
- Allowed methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Credentials supported for JWT token transmission

## Deployment Considerations

For production deployment, consider:

1. Use environment variables for sensitive configuration
2. Change JWT secret key in application.yml
3. Update database credentials
4. Configure file storage (local vs cloud S3)
5. Set up proper logging and monitoring
6. Enable HTTPS for production
7. Configure database backups

---

**Architecture Summary:** The system uses a clean, maintainable architecture with proper separation of concerns, making it easy to understand, test, and extend.
