from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Any, List
import json
import logging
from decimal import Decimal
from datetime import datetime

from app.db.session import get_db
from app.services.openai_service import OpenAIService
from app.core.security import oauth2_scheme
from app.schemas.search import SearchQuery, SearchResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Database schema information for OpenAI
SCHEMA_INFO = """
Database Schema for Airport Database Assistant:

1. Users Table
- id (SERIAL PRIMARY KEY)
- email (VARCHAR(255) UNIQUE)
- hashed_password (VARCHAR(255))
- full_name (VARCHAR(255))
- role (VARCHAR(50))
- is_active (BOOLEAN)
- created_at (TIMESTAMP)

2. Airlines Table
- id (SERIAL PRIMARY KEY)
- code (VARCHAR(10) UNIQUE)
- name (VARCHAR(255))
- country (VARCHAR(255))
- logo_url (VARCHAR(255))
- website_url (VARCHAR(255))

3. Aircraft Types Table
- id (SERIAL PRIMARY KEY)
- code (VARCHAR(10) UNIQUE)
- manufacturer (VARCHAR(255))
- model (VARCHAR(255))
- capacity (INTEGER)
- range_km (INTEGER)

4. Airports Table
- id (SERIAL PRIMARY KEY)
- code (VARCHAR(10) UNIQUE)
- name (VARCHAR(255))
- city (VARCHAR(255))
- country (VARCHAR(255))
- latitude (DECIMAL)
- longitude (DECIMAL)
- timezone (VARCHAR(50))
- terminal_count (INTEGER)
- runway_count (INTEGER)
- description (TEXT)

5. Flights Table
- id (SERIAL PRIMARY KEY)
- flight_number (VARCHAR(20))
- airline_id (INTEGER REFERENCES airlines(id))
- departure_airport_id (INTEGER REFERENCES airports(id))
- arrival_airport_id (INTEGER REFERENCES airports(id))
- departure_time (TIMESTAMP)
- arrival_time (TIMESTAMP)
- duration (INTEGER)
- aircraft_type_id (INTEGER REFERENCES aircraft_types(id))
- status (VARCHAR(50))
- gate (VARCHAR(10))
- terminal (INTEGER)
- price (DECIMAL)

Relationships:
- Flights.airline_id -> Airlines.id
- Flights.departure_airport_id -> Airports.id
- Flights.arrival_airport_id -> Airports.id
- Flights.aircraft_type_id -> Aircraft_Types.id
"""

def json_serializer(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

@router.post("", response_model=SearchResponse)
def search(
    query: SearchQuery,
    db: Session = Depends(get_db)
) -> Any:
    try:
        logger.info(f"Received search query: {query.query}")
        
        # Generate SQL query using OpenAI
        logger.info("Generating SQL query using OpenAI...")
        sql_query = OpenAIService.generate_sql_query(query.query, SCHEMA_INFO)
        logger.info(f"Generated SQL query: {sql_query}")
        
        # Execute the query against the database
        logger.info("Executing SQL query...")
        result = db.execute(text(sql_query))
        
        # Convert result rows to dictionaries
        columns = result.keys()
        results = []
        for row in result:
            row_dict = {}
            for i, col in enumerate(columns):
                value = row[i]
                # Convert Decimal and datetime to JSON-serializable types
                if isinstance(value, (Decimal, datetime)):
                    value = json_serializer(value)
                row_dict[col] = value
            results.append(row_dict)
            
        logger.info(f"Query executed successfully. Found {len(results)} results")
        
        # Generate explanation
        logger.info("Generating explanation...")
        explanation = OpenAIService.explain_query_results(results, query.query)
        logger.info("Explanation generated successfully")
        
        response = {
            "query": query.query,
            "sql_query": sql_query,
            "results": results,
            "explanation": explanation
        }
        
        logger.info(f"Returning response: {json.dumps(response, indent=2, default=json_serializer)}")
        return response
        
    except Exception as e:
        logger.error(f"Error processing search query: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) 