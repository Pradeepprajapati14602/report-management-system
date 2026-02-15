# Report Management & Status Tracking System

A full-stack application for managing medical reports with status tracking, built with React, Spring Boot, and PostgreSQL.

## Features

- User authentication with JWT tokens
- Upload medical reports (PDF, images, documents)
- Track report processing status (UPLOADED → PROCESSING → COMPLETED)
- View report details and generated summaries
- User registration and management

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security (JWT Authentication)
- Spring Data JPA
- PostgreSQL
- Flyway (Database Migrations)
- Maven

### Frontend
- React 18
- React Router 6
- Axios
- Vite

## Architecture

### Backend Architecture (Layered)
```
Controller → Service → Repository → Database
```

**Package Structure:**
- `config/`: Security and application configuration
- `controller/`: REST API endpoints
- `dto/`: Data Transfer Objects for request/response
- `exception/`: Custom exceptions and global exception handler
- `model/`: JPA entities (User, Report)
- `repository/`: Data access layer
- `security/`: JWT authentication filter and user details service
- `service/`: Business logic layer
- `util/`: Utility classes (JWT token generation)

### Frontend Structure
```
src/
├── components/     # Reusable components
├── context/        # React context for state management
├── pages/          # Page components
├── services/       # API service layer
└── utils/          # Helper functions
```

## Prerequisites

Before running this application, make sure you have installed:

- Java 17 or higher
- Maven 3.6 or higher
- Node.js 18 or higher
- PostgreSQL 15 or higher

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database using pgAdmin:

```sql
CREATE DATABASE report_management_db;
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Configure the database connection in `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/report_management_db
    username: postgres
    password: your_password
```

Build and run the backend:

```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080/api`

Flyway migrations will run automatically on first startup.

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Default Login Credentials

First, update the password in the database using the SQL from [CREDENTIALS.md](CREDENTIALS.md).

| Role | Email | Password |
|------|-------|----------|
| User | user@example.com | password123 |
| Admin | admin@example.com | password123 |

You can also register new users at `http://localhost:5173/register`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/users` | Register new user (public) |

### Reports
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/reports` | Upload new report | Yes |
| GET | `/api/reports` | Get all user reports | Yes |
| GET | `/api/reports/{id}` | Get report by ID | Yes |
| PATCH | `/api/reports/{id}/status` | Update report status | Yes |
| DELETE | `/api/reports/{id}` | Delete report | Yes |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/users` | Get all users | Yes |
| DELETE | `/api/users/{id}` | Delete user | Yes |

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL PK | Unique user identifier |
| email | VARCHAR(255) UNIQUE | User's email address |
| password | VARCHAR(255) | BCrypt hashed password |
| role | VARCHAR(20) | USER or ADMIN |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last update time |

### Reports Table
| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL PK | Unique report identifier |
| user_id | BIGINT FK | Reference to users table |
| name | VARCHAR(255) | Report name |
| type | VARCHAR(100) | Report type |
| file_path | VARCHAR(500) | Path to uploaded file |
| status | VARCHAR(50) | UPLOADED/PROCESSING/COMPLETED |
| summary | TEXT | Generated summary |
| report_date | DATE | Date of the report |
| created_at | TIMESTAMP | Upload timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## Status Workflow

Reports move through these statuses:

1. **UPLOADED** - Initial state after file upload
2. **PROCESSING** - Report is being processed
3. **COMPLETED** - Processing complete, summary available

## Security Features

- BCrypt password hashing
- JWT token-based authentication (24-hour expiry)
- CORS enabled for frontend-backend communication
- SQL injection prevention (JPA/Hibernate)
- Input validation on all endpoints

## Project Structure

```
report-management-system/
├── backend/                    # Spring Boot Application
│   ├── src/main/java/
│   │   └── com/reportmanagement/
│   │       ├── config/         # Configuration
│   │       ├── controller/     # REST Controllers
│   │       ├── dto/            # Data Transfer Objects
│   │       ├── exception/      # Custom Exceptions
│   │       ├── model/          # Entity Models
│   │       ├── repository/     # Data Access Layer
│   │       ├── security/       # Security Config
│   │       ├── service/        # Business Logic
│   │       └── util/           # Utilities
│   └── src/main/resources/
│       ├── application.yml    # Config
│       └── db/migration/       # Flyway Migrations
│
├── frontend/                   # React Application
│   ├── src/
│   │   ├── components/         # React Components
│   │   ├── config/             # Configuration
│   │   ├── context/            # React Context
│   │   ├── pages/              # Page Components
│   │   ├── services/           # API Services
│   │   └── utils/              # Helper Functions
│   └── .env                    # Environment Variables
│
└── database/                   # Database Scripts
```

## Additional Documentation

- [Architecture Overview](ARCHITECTURE.md) - System architecture explanation
- [Database Schema](DATABASE_SCHEMA.md) - Detailed database documentation
- [Credentials Guide](CREDENTIALS.md) - Setup credentials reference
- [Migration Guide](backend/MIGRATIONS.md) - Flyway migrations documentation

## Screenshots

### Login Page
Clean login interface with demo credentials provided.

### Dashboard
- View all reports sorted by latest first
- Quick status badges
- Actions for each report (View, Delete, Status Update)

### Report Details
- Full report information
- Status workflow visualization
- Summary display (when completed)

### User Management
- Create new users with role selection
- View all users in the system
- Delete users (with self-deletion protection)

## Error Handling

The application uses global exception handling with consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2026-02-16T10:30:00"
}
```

## Production Build

**Backend:**
```bash
cd backend
mvn clean package
java -jar target/report-management-backend-1.0.0.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the dist/ folder with your preferred web server
```

## License

This project is for assessment purposes only.

---

**Version:** 1.0.0
**Last Updated:** February 2026
