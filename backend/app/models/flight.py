from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Float
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class Flight(BaseModel):
    __tablename__ = "flights"

    flight_number = Column(String, nullable=False)
    airline = Column(String, nullable=False)
    departure_airport_id = Column(Integer, ForeignKey("airports.id"), nullable=False)
    arrival_airport_id = Column(Integer, ForeignKey("airports.id"), nullable=False)
    departure_time = Column(DateTime, nullable=False)
    arrival_time = Column(DateTime, nullable=False)
    duration = Column(Integer)  # in minutes
    aircraft_type = Column(String)
    status = Column(String)  # Scheduled, Delayed, Cancelled, etc.
    gate = Column(String)
    terminal = Column(String)
    price = Column(Float)
    
    # Relationships
    departure_airport = relationship("Airport", foreign_keys=[departure_airport_id])
    arrival_airport = relationship("Airport", foreign_keys=[arrival_airport_id]) 