
import React from 'react';
import { Plane } from 'lucide-react';

type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-azure-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/90 p-4 rounded-full mb-4 shadow-lg hover:scale-105 transition-transform">
            <Plane className="text-primary-foreground h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-center text-primary dark:text-primary">{title}</h1>
          <div className="mt-2 h-1 w-20 bg-primary/50 rounded"></div>
        </div>
        
        <div className="bg-card text-card-foreground shadow-xl rounded-lg p-8 backdrop-blur-sm border border-border/50">
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
