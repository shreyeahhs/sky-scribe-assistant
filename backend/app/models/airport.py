from sqlalchemy import Column, String, Float, Integer
from app.models.base import BaseModel

class Airport(BaseModel):
    __tablename__ = "airports"

    code = Column(String(3), unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    country = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timezone = Column(String, nullable=False)
    terminal_count = Column(Integer)
    runway_count = Column(Integer)
    description = Column(String) 