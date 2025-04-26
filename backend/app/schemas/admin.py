from pydantic import BaseModel

class AdminCommand(BaseModel):
    command: str

class AdminResponse(BaseModel):
    command: str
    sql_query: str
    message: str 