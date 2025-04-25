
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Clock, Download, Database, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type HistoryItem = {
  query: string;
  sql: string;
  timestamp: string;
  resultCount: number;
};

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load query history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem('queryHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const filteredHistory = history.filter(item =>
    item.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all query history?')) {
      localStorage.setItem('queryHistory', '[]');
      setHistory([]);
      toast({
        title: "History Cleared",
        description: "Your query history has been deleted",
      });
    }
  };

  const exportHistory = () => {
    if (!history.length) return;
    
    const headers = Object.keys(history[0]);
    const csvContent = [
      headers.join(','),
      ...history.map(item => 
        headers.map(header => 
          `"${String((item as any)[header] || '').replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `query-history-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Query History</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your past queries
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportHistory} 
              disabled={!history.length}
            >
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
            
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={clearHistory}
              disabled={!history.length} 
            >
              <Trash2 className="h-4 w-4 mr-1" /> Clear History
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search queries..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-medium">No query history found</h3>
                <p className="text-muted-foreground">
                  {history.length ? 'No matching queries in your history.' : 'Your past queries will appear here.'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Query</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead className="w-32">SQL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                      <TableCell>{item.query}</TableCell>
                      <TableCell className="text-center">{item.resultCount}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="w-full">
                          <Database className="h-4 w-4 mr-1" /> View SQL
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default History;
