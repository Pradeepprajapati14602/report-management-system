# Quick Start Guide

This guide will help you get the Report Management System up and running quickly.

## Option 1: Using Docker (Recommended)

The fastest way to run the entire application:

```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:8080/api
- Database: PostgreSQL on port 5432

## Option 2: Manual Setup

### Step 1: Start PostgreSQL

```bash
# Create database
createdb report_management_db

# Or using psql
psql -U postgres
CREATE DATABASE report_management_db;
\q

# Run init script
psql -U postgres -d report_management_db -f database/init.sql
```

### Step 2: Start Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will be available at http://localhost:8080/api

### Step 3: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at http://localhost:5173

## Login Credentials

```
Email: user@example.com
Password: password123
```

## Testing the Application

1. Open http://localhost:5173 in your browser
2. Login with the demo credentials
3. Upload a report using the "Upload New Report" button
4. View the report details
5. Update the status through the workflow

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running on port 5432
- Verify database credentials in `backend/src/main/resources/application.yml`

### Frontend can't connect to backend
- Ensure backend is running on port 8080
- Check CORS configuration in SecurityConfig.java

### File upload fails
- Ensure the uploads directory exists or can be created
- Check file size limits in application.yml

## Project Structure

```
report-management-system/
├── backend/                 # Spring Boot application
│   ├── src/
│   │   └── main/
│   │       ├── java/        # Java source code
│   │       └── resources/   # Configuration files
│   ├── pom.xml             # Maven dependencies
│   └── Dockerfile          # Docker build file
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── context/        # React context
│   ├── package.json        # npm dependencies
│   └── Dockerfile          # Docker build file
├── database/               # Database scripts
│   └── init.sql           # Initialization script
├── docker-compose.yml     # Docker compose configuration
├── README.md              # Full documentation
└── QUICKSTART.md          # This file
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the API endpoints using the frontend or tools like Postman
- Customize the application to fit your needs

## Support

For issues or questions, please refer to the main README.md file.
