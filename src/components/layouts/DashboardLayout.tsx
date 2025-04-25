
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Database, 
  Search, 
  History,
  User,
  Users,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Search', icon: Search, path: '/dashboard', admin: false },
    { label: 'History', icon: History, path: '/history', admin: false },
    { label: 'Users', icon: Users, path: '/users', admin: true },
    { label: 'Database', icon: Database, path: '/database', admin: true },
    { label: 'Settings', icon: Settings, path: '/settings', admin: false },
  ];

  // Filter menu items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (item.admin) {
      return user?.role === 'admin';
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-primary text-white rounded-full shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative z-40 transition-transform duration-300 ease-in-out w-64 h-full bg-sidebar text-sidebar-foreground shadow-lg`}
      >
        <div className="p-6 flex items-center space-x-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <Database className="h-6 w-6 text-sidebar-primary" />
          </div>
          <h1 className="text-xl font-bold">Sky Scribe</h1>
        </div>

        <Separator className="bg-sidebar-border" />

        <div className="p-4">
          {user && (
            <div className="mb-6 flex items-center space-x-3 p-3 rounded-md bg-sidebar-accent">
              <div className="bg-primary rounded-full p-1">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">{user.role}</p>
              </div>
            </div>
          )}

          <nav className="space-y-1">
            {filteredNavItems.map((item) => (
              <button
                key={item.path}
                className="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-sidebar-accent transition-colors text-left"
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
              >
                <item.icon className="h-5 w-5 text-sidebar-primary" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button
            variant="outline"
            className="w-full border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 md:p-8 md:ml-0 overflow-y-auto">
        {children}
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
