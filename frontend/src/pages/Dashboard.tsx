import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import QueryInput from '@/components/QueryInput';
import SqlDisplay from '@/components/SqlDisplay';
import ResultsDisplay from '@/components/ResultsDisplay';
import { useToast } from '@/components/ui/use-toast';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  // Add other result properties as needed
}

const Dashboard = () => {
  const [query, setQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleQuerySubmit = async (inputQuery: string) => {
    setQuery(inputQuery);
    setIsProcessing(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ query: inputQuery })
      });

      if (!response.ok) {
        throw new Error('Failed to process query');
      }

      const data = await response.json();
      setSqlQuery(data.sql_query);
      setResults(data.results);
      
      // Save to query history
      const history = JSON.parse(localStorage.getItem('queryHistory') || '[]');
      history.unshift({
        query: inputQuery,
        sql: data.sql_query,
        timestamp: new Date().toISOString(),
        resultCount: data.results.length
      });
      localStorage.setItem('queryHistory', JSON.stringify(history.slice(0, 50)));
      
      toast({
        title: "Query Processed",
        description: `Found ${data.results.length} results`,
      });
    } catch (error) {
      console.error('Query processing error:', error);
      toast({
        variant: "destructive",
        title: "Query Processing Failed",
        description: "There was an error processing your query."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    
    try {
      const response = await fetch('/api/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error('Failed to perform search');
      }

      const data = await response.json();
      setSearchResults(data.results);
      
      toast({
        title: "Search Complete",
        description: `Found ${data.results.length} results`,
      });
    } catch (error) {
      console.error('Error performing search:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to perform search. Please try again.",
      });
    } finally {
      setIsSearching(false);
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
