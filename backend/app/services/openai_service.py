from openai import OpenAI
from app.core.config import settings
from typing import List, Dict, Any
import json
from decimal import Decimal
from datetime import datetime

client = OpenAI(api_key=settings.OPENAI_API_KEY)

# Mock implementation for testing
class MockOpenAIService:
    @staticmethod
    async def generate_sql_query(natural_language_query: str, schema_info: str) -> str:
        # Simple mock implementation
        if "airport" in natural_language_query.lower():
            return "SELECT * FROM airports LIMIT 5"
        elif "flight" in natural_language_query.lower():
            return "SELECT * FROM flights LIMIT 5"
        else:
            return "SELECT * FROM airports LIMIT 5"

    @staticmethod
    async def explain_query_results(results: List[Dict[str, Any]], query: str) -> str:
        return f"Found {len(results)} results for your query: {query}"

# Use mock service for now
OpenAIService = MockOpenAIService

class OpenAIService:
    @staticmethod
    def generate_sql_query(natural_language_query: str, schema_info: str) -> str:
        prompt = f"""
        Given the following database schema information:
        {schema_info}

        Convert this natural language query to SQL:
        {natural_language_query}

        IMPORTANT: You must return ONLY a valid SQL query. Do not include any explanations or additional text.
        The query should be safe and follow SQL best practices.
        If the query is unclear, return a simple query like 'SELECT * FROM airports LIMIT 5'
        """

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a SQL expert. Convert natural language to SQL queries. Return ONLY the SQL query, nothing else."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1
        )

        # Extract just the SQL query, removing any markdown or explanations
        sql_query = response.choices[0].message.content.strip()
        if sql_query.startswith("```sql"):
            sql_query = sql_query[6:]
        if sql_query.endswith("```"):
            sql_query = sql_query[:-3]
        sql_query = sql_query.strip()
        
        # If the response doesn't look like SQL, return a default query
        if not any(keyword in sql_query.upper() for keyword in ["SELECT", "INSERT", "UPDATE", "DELETE"]):
            return "SELECT * FROM airports LIMIT 5"
            
        return sql_query

    @staticmethod
    async def generate_mock_results(sql_query: str) -> List[Dict[str, Any]]:
        prompt = f"""
        Given this SQL query:
        {sql_query}

        Generate realistic mock data that would be returned by this query.
        Return the data as a JSON array of objects.
        Each object should have appropriate field names and realistic values.
        Generate 3-5 rows of data.
        """

        response = await client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a database expert generating realistic mock data."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        try:
            return json.loads(response.choices[0].message.content.strip())
        except json.JSONDecodeError:
            # If the response isn't valid JSON, try to extract JSON from the response
            import re
            json_match = re.search(r'```json\n(.*?)\n```', response.choices[0].message.content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(1))
            raise ValueError("Could not parse OpenAI response as JSON")

    @staticmethod
    async def generate_admin_query(natural_language_command: str, schema_info: str) -> str:
        prompt = f"""
        Given the following database schema information:
        {schema_info}

        Convert this natural language command to SQL:
        {natural_language_command}

        Please provide only the SQL query without any explanations.
        """

        response = await client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a SQL expert. Convert natural language to SQL queries for database modifications."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1
        )

        return response.choices[0].message.content.strip()

    @staticmethod
    def explain_query_results(results: List[Dict[str, Any]], query: str) -> str:
        # Convert Decimal and datetime to JSON-serializable types
        def json_serializer(obj):
            if isinstance(obj, Decimal):
                return float(obj)
            if isinstance(obj, datetime):
                return obj.isoformat()
            raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")

        prompt = f"""
        Explain these query results in natural language:
        Query: {query}
        Results: {json.dumps(results, indent=2, default=json_serializer)}

        Provide a clear and concise explanation of what these results mean.
        """

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant explaining database query results."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

        return response.choices[0].message.content.strip() 