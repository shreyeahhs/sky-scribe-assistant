
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { 
  LogOut, 
  Database, 
  Search, 
  History,
  User,
  Users,
  Settings,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ThemeToggle from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    <div className="min-h-screen flex flex-col md:flex-row bg-background transition-colors duration-300">
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-primary text-primary-foreground rounded-full shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed md:sticky top-0 h-full transition-all duration-300 ease-in-out z-40 bg-card border-r",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isSidebarCollapsed ? "w-[80px]" : "w-64"
        )}
      >
        <div className={cn(
          "flex items-center p-4",
          isSidebarCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold">Sky Scribe</h1>
            </div>
          )}
          {isSidebarCollapsed && (
            <div className="bg-primary/20 p-2 rounded-full">
              <Database className="h-5 w-5 text-primary" />
            </div>
          )}
          <button 
            className={cn(
              "hidden md:flex p-1.5 rounded-md bg-accent/50 hover:bg-accent transition-colors",
              isSidebarCollapsed && "rotate-180 mx-auto"
            )}
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <Separator />

        <div className="p-4">
          {user && (
            <div className={cn(
              "mb-6 flex items-center p-3 rounded-md bg-accent/50",
              isSidebarCollapsed ? "justify-center" : "space-x-3"
            )}>
              <div className="bg-primary rounded-full p-1 flex-shrink-0">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              {!isSidebarCollapsed && (
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground capitalize truncate">{user.role}</p>
                </div>
              )}
            </div>
          )}

          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = window.location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center w-full p-3 rounded-md transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent/50 text-foreground",
                    isSidebarCollapsed ? "justify-center" : "space-x-3"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-primary-foreground" : "text-primary"
                  )} />
                  {!isSidebarCollapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Fixed the footer layout to prevent button overlap */}
          <div className={cn(
            "flex",
            isSidebarCollapsed ? "justify-center flex-col space-y-3" : "justify-between items-center"
          )}>
            <ThemeToggle isSidebarCollapsed={isSidebarCollapsed} />
            
            <Button
              variant="outline"
              size={isSidebarCollapsed ? "icon" : "default"}
              className={cn(
                "hover:bg-accent/50 hover:text-foreground border-muted",
                isSidebarCollapsed ? "w-10 h-10 p-0" : ""
              )}
              onClick={handleLogout}
            >
              <LogOut className={cn(
                "h-4 w-4", 
                isSidebarCollapsed ? "" : "mr-2"
              )} />
              {!isSidebarCollapsed && "Logout"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
