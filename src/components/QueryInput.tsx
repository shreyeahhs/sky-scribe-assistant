
import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type QueryInputProps = {
  onSubmitQuery: (query: string) => void;
  isProcessing: boolean;
  placeholder?: string;
};

const QueryInput = ({ onSubmitQuery, isProcessing, placeholder }: QueryInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isProcessing) {
      onSubmitQuery(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder || "Ask a question about airport or flight data..."}
            className="resize-none pr-12 min-h-[100px]"
            disabled={isProcessing}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute bottom-3 right-3"
            disabled={!inputValue.trim() || isProcessing}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default QueryInput;
