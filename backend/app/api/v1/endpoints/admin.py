from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import Any, List
import pandas as pd
import io

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.airport import Airport
from app.models.flight import Flight
from app.services.openai_service import OpenAIService
from app.core.security import oauth2_scheme
from app.schemas.admin import AdminCommand, AdminResponse

router = APIRouter()

# Database schema information for OpenAI
SCHEMA_INFO = """
Tables:
- airports (id, code, name, city, country, latitude, longitude, timezone, terminal_count, runway_count, description)
- flights (id, flight_number, airline, departure_airport_id, arrival_airport_id, departure_time, arrival_time, duration, aircraft_type, status, gate, terminal, price)
"""

async def verify_admin(token: str = Depends(oauth2_scheme)) -> None:
    # This would be implemented in a proper authentication middleware
    pass

@router.post("/command", response_model=AdminResponse)
async def execute_admin_command(
    command: AdminCommand,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> Any:
    await verify_admin(token)
    
    # Generate SQL query using OpenAI
    sql_query = await OpenAIService.generate_admin_query(command.command, SCHEMA_INFO)
    
    try:
        # Execute the query
        result = db.execute(sql_query)
        db.commit()
        
        return {
            "command": command.command,
            "sql_query": sql_query,
            "message": "Command executed successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error executing command: {str(e)}"
        )

@router.post("/upload/airports")
async def upload_airports(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> Any:
    await verify_admin(token)
    
    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        
        for _, row in df.iterrows():
            airport = Airport(
                code=row['code'],
                name=row['name'],
                city=row['city'],
                country=row['country'],
                latitude=row['latitude'],
                longitude=row['longitude'],
                timezone=row['timezone'],
                terminal_count=row.get('terminal_count'),
                runway_count=row.get('runway_count'),
                description=row.get('description')
            )
            db.add(airport)
        
        db.commit()
        return {"message": "Airports uploaded successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error uploading airports: {str(e)}"
        )

@router.post("/upload/flights")
async def upload_flights(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> Any:
    await verify_admin(token)
    
    try:
        contents = await file.read()
        df = pd.read_excel(io.BytesIO(contents))
        
        for _, row in df.iterrows():
            flight = Flight(
                flight_number=row['flight_number'],
                airline=row['airline'],
                departure_airport_id=row['departure_airport_id'],
                arrival_airport_id=row['arrival_airport_id'],
                departure_time=row['departure_time'],
                arrival_time=row['arrival_time'],
                duration=row.get('duration'),
                aircraft_type=row.get('aircraft_type'),
                status=row.get('status'),
                gate=row.get('gate'),
                terminal=row.get('terminal'),
                price=row.get('price')
            )
            db.add(flight)
        
        db.commit()
        return {"message": "Flights uploaded successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error uploading flights: {str(e)}"
        ) 