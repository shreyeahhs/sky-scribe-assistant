from sqlalchemy import create_engine, text
from app.core.config import settings

def test_connection():
    try:
        # Create engine
        engine = create_engine(settings.DATABASE_URL)
        
        # Test connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("Database connection successful!")
            
            # Test query
            airports = connection.execute(text("SELECT code, name FROM airports LIMIT 5"))
            print("\nSample airports:")
            for airport in airports:
                print(f"{airport.code}: {airport.name}")
                
    except Exception as e:
        print(f"Error connecting to database: {e}")

if __name__ == "__main__":
    test_connection() 