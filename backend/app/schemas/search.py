from datetime import datetime
from pydantic import BaseModel
from typing import List, Dict, Any

class SearchQuery(BaseModel):
    query: str

class SearchResponse(BaseModel):
    query: str
    sql_query: str
    results: List[Dict[str, Any]]
    explanation: str

class SearchHistoryResponse(BaseModel):
    id: int
    query: str
    sql_query: str
    created_at: datetime
    result_count: int

    class Config:
        from_attributes = True 