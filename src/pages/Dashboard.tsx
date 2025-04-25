
import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import QueryInput from '@/components/QueryInput';
import SqlDisplay from '@/components/SqlDisplay';
import ResultsDisplay from '@/components/ResultsDisplay';
import { useToast } from '@/hooks/use-toast';

// Mock data for airports
const mockAirports = [
  { id: 1, code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA', timezone: 'GMT-5' },
  { id: 2, code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA', timezone: 'GMT-8' },
  { id: 3, code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', timezone: 'GMT+0' },
  { id: 4, code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', timezone: 'GMT+1' },
  { id: 5, code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan', timezone: 'GMT+9' }
];

// Mock data for flights
const mockFlights = [
  { id: 101, flight_number: 'AA123', departure_airport: 'JFK', arrival_airport: 'LAX', departure_time: '2025-04-25T08:30:00', arrival_time: '2025-04-25T11:45:00', status: 'On Time' },
  { id: 102, flight_number: 'BA456', departure_airport: 'LHR', arrival_airport: 'JFK', departure_time: '2025-04-25T10:15:00', arrival_time: '2025-04-25T13:20:00', status: 'Delayed' },
  { id: 103, flight_number: 'DL789', departure_airport: 'LAX', arrival_airport: 'CDG', departure_time: '2025-04-25T18:00:00', arrival_time: '2025-04-26T11:30:00', status: 'On Time' },
  { id: 104, flight_number: 'JL021', departure_airport: 'HND', arrival_airport: 'LHR', departure_time: '2025-04-25T22:45:00', arrival_time: '2025-04-26T03:15:00', status: 'On Time' }
];

// Mock function to simulate query processing
const processNaturalLanguageQuery = (query: string) => {
  // This is a very basic simulation that doesn't use actual NLP
  const lowerQuery = query.toLowerCase();
  
  // Simulate some different types of queries
  if (lowerQuery.includes('airport')) {
    return {
      sql: `SELECT * FROM airports WHERE name LIKE '%${query.replace(/'/g, "''")}%' OR city LIKE '%${query.replace(/'/g, "''")}%'`,
      results: mockAirports
    };
  }
  
  if (lowerQuery.includes('america') || lowerQuery.includes('usa')) {
    return {
      sql: `SELECT * FROM airports WHERE country = 'USA'`,
      results: mockAirports.filter(airport => airport.country === 'USA')
    };
  }
  
  if (lowerQuery.includes('evening') && lowerQuery.includes('flight')) {
    return {
      sql: `SELECT * FROM flights 
            WHERE EXTRACT(HOUR FROM departure_time) >= 17 
            AND EXTRACT(HOUR FROM departure_time) <= 23`,
      results: mockFlights.filter(flight => {
        const hour = new Date(flight.departure_time).getHours();
        return hour >= 17 && hour <= 23;
      })
    };
  }
  
  // Default to returning flights
  return {
    sql: `SELECT * FROM flights 
          WHERE departure_time >= CURRENT_DATE 
          ORDER BY departure_time ASC`,
    results: mockFlights
  };
};

const Dashboard = () => {
  const [query, setQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const handleQuerySubmit = async (inputQuery: string) => {
    setQuery(inputQuery);
    setIsProcessing(true);
    
    try {
      // In a real app, this would be an API call to a backend service
      setTimeout(() => {
        const response = processNaturalLanguageQuery(inputQuery);
        setSqlQuery(response.sql);
        setResults(response.results);
        setIsProcessing(false);
        
        // Save to query history
        const history = JSON.parse(localStorage.getItem('queryHistory') || '[]');
        history.unshift({
          query: inputQuery,
          sql: response.sql,
          timestamp: new Date().toISOString(),
          resultCount: response.results.length
        });
        localStorage.setItem('queryHistory', JSON.stringify(history.slice(0, 50)));
        
      }, 1500); // Simulate processing delay
    } catch (error) {
      console.error('Query processing error:', error);
      toast({
        variant: "destructive",
        title: "Query Processing Failed",
        description: "There was an error processing your query."
      });
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Sky Scribe Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Ask questions about airports, flights, routes and more in natural language.
          </p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">What would you like to know?</h2>
          <QueryInput 
            onSubmitQuery={handleQuerySubmit} 
            isProcessing={isProcessing} 
            placeholder="Example: Show me flights leaving New York tomorrow evening" 
          />
          
          {isProcessing && (
            <div className="mt-4 animate-pulse flex space-x-4 items-center">
              <div className="h-3 w-3 bg-primary rounded-full"></div>
              <div className="h-3 w-3 bg-primary rounded-full animation-delay-200"></div>
              <div className="h-3 w-3 bg-primary rounded-full animation-delay-400"></div>
              <span className="text-sm text-muted-foreground">Processing your query...</span>
            </div>
          )}
          
          {sqlQuery && !isProcessing && (
            <SqlDisplay sql={sqlQuery} />
          )}
        </div>
        
        <ResultsDisplay results={results} isLoading={isProcessing} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
