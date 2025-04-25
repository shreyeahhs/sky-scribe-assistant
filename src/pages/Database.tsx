
import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import QueryInput from '@/components/QueryInput';
import SqlDisplay from '@/components/SqlDisplay';
import { Database, Plus, Upload, RefreshCw } from 'lucide-react';
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

const Database = () => {
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
    
    // Simulate processing delay
    setTimeout(() => {
      // Generate a mock SQL based on the natural language query
      let sql = '';
      
      if (query.toLowerCase().includes('add') || query.toLowerCase().includes('new airport')) {
        const airportName = query.match(/add ([\w\s]+) airport/) 
          || query.match(/new airport ([\w\s]+)/) 
          || ['', 'New Airport'];
        
        sql = `INSERT INTO airports (code, name, city, country, timezone)
VALUES ('XYZ', '${airportName[1].trim()}', 'New City', 'Country', 'GMT+0');`;
      } else if (query.toLowerCase().includes('update')) {
        sql = `UPDATE airports
SET timezone = 'GMT+1'
WHERE code = 'JFK';`;
      } else if (query.toLowerCase().includes('delete')) {
        sql = `DELETE FROM routes
WHERE departure_airport = 'OLD' AND arrival_airport = 'XXX';`;
      } else {
        sql = `SELECT * FROM airports WHERE country = 'USA';`;
      }
      
      setGeneratedQuery(sql);
      setIsProcessing(false);
      
      toast({
        title: "Query Generated",
        description: "SQL query has been generated from your request",
      });
    }, 1500);
  };

  const handleExecuteQuery = () => {
    if (!generatedQuery) return;
    
    // Simulate execution
    toast({
      title: "Query Executed Successfully",
      description: "The database has been updated",
    });
    
    setGeneratedQuery('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Database Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage airport data using natural language commands
          </p>
        </div>
        
        <Tabs defaultValue="manage">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="manage">Manage Data</TabsTrigger>
            <TabsTrigger value="tables">Database Tables</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage" className="mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Natural Language Database Management</h2>
              <p className="text-muted-foreground mb-6">
                Tell the assistant what you want to do in plain English, and it will generate the SQL for you.
              </p>
              
              <QueryInput
                onSubmitQuery={handleNlpQuery}
                isProcessing={isProcessing}
                placeholder="Example: Add new airport called San Francisco International located in USA"
              />
              
              {generatedQuery && (
                <div className="mt-4">
                  <SqlDisplay sql={generatedQuery} />
                  
                  <div className="flex justify-end mt-2">
                    <Button onClick={handleExecuteQuery}>
                      Execute Query
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="tables" className="mt-4">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Database Tables</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Table
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockTables.map((table) => (
                  <Card key={table.name} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Database className="h-5 w-5 text-primary mr-2" />
                        <div>
                          <h3 className="font-medium">{table.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {table.rowCount.toLocaleString()} rows • Updated {table.lastUpdate}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
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

export default Database;
