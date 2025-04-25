
import React from 'react';
import { Plane } from 'lucide-react';

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-azure-100">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary p-4 rounded-full mb-4">
            <Plane className="text-white h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-center text-primary">{title}</h1>
          <div className="mt-2 h-1 w-20 bg-secondary rounded"></div>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-8">
          {children}
        </div>
        
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Sky Scribe - Your Intelligent Airport Database Assistant
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
