
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SqlDisplayProps {
  sql: string;
}

const SqlDisplay: React.FC<SqlDisplayProps> = ({ sql }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const formatSql = (sql: string) => {
    // Simple SQL syntax highlighting
    return sql
      .replace(
        /\b(SELECT|FROM|WHERE|JOIN|AND|OR|GROUP BY|ORDER BY|LIMIT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|INTO|VALUES|SET|AS|ON|INNER|LEFT|RIGHT|OUTER|USING|HAVING)\b/gi,
        '<span class="query-highlight">$1</span>'
      );
  };

  return (
    <div className="relative bg-gray-900 rounded-md text-gray-200 p-4 mt-2 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-400">Generated SQL Query</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-gray-400 hover:text-white"
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4 mr-1" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" /> Copy
            </>
          )}
        </Button>
      </div>
      <pre 
        className="overflow-x-auto text-sm"
        dangerouslySetInnerHTML={{ __html: formatSql(sql) }}
      />
    </div>
  );
};

export default SqlDisplay;
