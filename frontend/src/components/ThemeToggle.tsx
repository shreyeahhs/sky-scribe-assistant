
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ThemeToggleProps {
  isSidebarCollapsed?: boolean;
}

const ThemeToggle = ({ isSidebarCollapsed }: ThemeToggleProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    // Check if user has already set a preference
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    // Check for system preference
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    // Set initial theme
    const initialTheme = storedTheme || systemPreference;
    setTheme(initialTheme as 'light' | 'dark');
    
    // Apply theme to document
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className={`rounded-full w-9 h-9 transition-all ${isSidebarCollapsed ? 'mx-auto' : ''}`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            ) : (
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle {theme === 'light' ? 'dark' : 'light'} mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle;
