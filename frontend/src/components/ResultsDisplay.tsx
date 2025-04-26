
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

interface ResultsDisplayProps {
  results: any[];
  isLoading: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, isLoading }) => {
  // Function to export results as CSV
  const exportToCsv = () => {
    if (!results.length) return;

    const headers = Object.keys(results[0]);
    const csvContent = [
      headers.join(','),
      ...results.map(row => 
        headers.map(header => 
          `"${String(row[header] || '').replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `sky-scribe-results-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </Card>
    );
  }

  if (!results.length) {
    return null;
  }

  const headers = Object.keys(results[0]);

  return (
    <Card className="overflow-hidden result-card">
      <div className="p-4 flex justify-between items-center bg-secondary/5 border-b">
        <h3 className="font-medium">Query Results</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={exportToCsv}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export CSV</span>
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header} className="whitespace-nowrap">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((header) => (
                  <TableCell key={`${rowIndex}-${header}`} className="whitespace-nowrap">
                    {row[header] !== null && row[header] !== undefined ? String(row[header]) : ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default ResultsDisplay;
