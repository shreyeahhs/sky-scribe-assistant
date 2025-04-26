from sqlalchemy import Column, String, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class SearchHistory(BaseModel):
    __tablename__ = "search_history"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    query = Column(Text, nullable=False)
    generated_sql = Column(Text, nullable=False)
    result_count = Column(Integer)
    
    # Relationship
    user = relationship("User") 