import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import QueryInput from '@/components/QueryInput';
import SqlDisplay from '@/components/SqlDisplay';
import { DatabaseIcon, Plus, Upload, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

// Mock data for tables
const mockTables = [
  { name: 'airports', rowCount: 5893, lastUpdate: '2025-04-20' },
  { name: 'flights', rowCount: 32567, lastUpdate: '2025-04-25' },
  { name: 'airlines', rowCount: 783, lastUpdate: '2025-04-18' },
  { name: 'routes', rowCount: 12532, lastUpdate: '2025-04-15' },
  { name: 'passengers', rowCount: 203456, lastUpdate: '2025-04-22' }
];

const DatabasePage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedQuery, setGeneratedQuery] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleNlpQuery = async (query: string) => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/v1/admin/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ command: query })
      });

      if (!response.ok) {
        throw new Error('Failed to generate query');
      }

      const data = await response.json();
      setGeneratedQuery(data.sql_query);
      
      toast({
        title: "Query Generated",
        description: "SQL query has been generated from your request",
      });
    } catch (error) {
      console.error('Error generating query:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate SQL query. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteQuery = async () => {
    if (!generatedQuery) return;
    
    try {
      const response = await fetch('/api/v1/admin/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ sql_query: generatedQuery })
      });

      if (!response.ok) {
        throw new Error('Failed to execute query');
      }

      toast({
        title: "Query Executed Successfully",
        description: "The database has been updated",
      });
      
      setGeneratedQuery('');
    } catch (error) {
      console.error('Error executing query:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to execute SQL query. Please try again.",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Database Management</h1>
          <p className="text-muted-foreground text-lg">
            Manage airport data using natural language commands
          </p>
        </div>
        
        <Tabs defaultValue="manage" className="space-y-6">
          <TabsList className="bg-background w-full max-w-md grid grid-cols-2 p-1">
            <TabsTrigger value="manage" className="text-base">Manage Data</TabsTrigger>
            <TabsTrigger value="tables" className="text-base">Database Tables</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage">
            <Card className="p-8 shadow-lg border-2">
              <h2 className="text-2xl font-semibold mb-4">Natural Language Database Management</h2>
              <p className="text-muted-foreground mb-8 text-base">
                Tell the assistant what you want to do in plain English, and it will generate the SQL for you.
              </p>
              
              <QueryInput
                onSubmitQuery={handleNlpQuery}
                isProcessing={isProcessing}
                placeholder="Example: Add new airport called San Francisco International located in USA"
              />
              
              {generatedQuery && (
                <div className="mt-6 space-y-4">
                  <SqlDisplay sql={generatedQuery} />
                  
                  <div className="flex justify-end">
                    <Button onClick={handleExecuteQuery} size="lg" className="px-8">
                      Execute Query
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="tables">
            <Card className="p-8 shadow-lg border-2">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold">Database Tables</h2>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Import Data
                  </Button>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Table
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockTables.map((table) => (
                  <Card 
                    key={table.name} 
                    className="p-6 hover:bg-accent/5 transition-colors border-2 relative group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <DatabaseIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg mb-1">{table.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {table.rowCount.toLocaleString()} rows • Updated {table.lastUpdate}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DatabasePage;
