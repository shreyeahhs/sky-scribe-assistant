
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 bg-primary/10 h-24 w-24 rounded-full flex items-center justify-center mx-auto">
          <MapPin className="h-12 w-12 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This destination doesn't exist in our database. Let's navigate back to a known location.
        </p>
        
        <Button onClick={() => navigate('/dashboard')} className="mx-auto">
          <ArrowLeft className="mr-2 h-4 w-4" /> Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
