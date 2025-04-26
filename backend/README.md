# Airport Database Assistant - Backend

This is the backend service for the Airport Database Assistant, built with FastAPI and PostgreSQL.

## Features

- User authentication (admin and regular users)
- Natural language query processing using OpenAI
- Database management for airports and flights
- Search history tracking
- Admin commands for data management
- Excel file upload support for bulk data import

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory with the following variables:
```
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=airport_db
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
```

4. Set up the PostgreSQL database:
```bash
createdb airport_db
```

5. Run the application:
```bash
uvicorn main:app --reload
```

## API Endpoints

### Authentication
- POST `/api/v1/auth/register` - Register a new user
- POST `/api/v1/auth/token` - Login and get access token

### Search
- POST `/api/v1/search/query` - Submit a natural language query
- GET `/api/v1/search/history` - Get search history

### Admin
- POST `/api/v1/admin/command` - Execute admin commands
- POST `/api/v1/admin/upload/airports` - Upload airports data
- POST `/api/v1/admin/upload/flights` - Upload flights data

## Database Schema

### Airports
- id (Primary Key)
- code (Unique)
- name
- city
- country
- latitude
- longitude
- timezone
- terminal_count
- runway_count
- description

### Flights
- id (Primary Key)
- flight_number
- airline
- departure_airport_id (Foreign Key)
- arrival_airport_id (Foreign Key)
- departure_time
- arrival_time
- duration
- aircraft_type
- status
- gate
- terminal
- price

### Users
- id (Primary Key)
- email (Unique)
- hashed_password
- full_name
- role
- is_active

### Search History
- id (Primary Key)
- user_id (Foreign Key)
- query
- generated_sql
- result_count
- created_at 