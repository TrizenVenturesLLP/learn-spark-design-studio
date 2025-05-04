
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, FileText, Calendar, 
  MessageSquare, GraduationCap, UserCircle, 
  Settings, LogOut, ChevronLeft, Menu
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, name: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, name: 'Courses', path: '/courses' },
    { icon: FileText, name: 'Assignments', path: '/assignments' },
    { icon: Calendar, name: 'Calendar', path: '/calendar' },
    { icon: MessageSquare, name: 'Discussions', path: '/discussions' },
    { icon: GraduationCap, name: 'Grades', path: '/grades' },
    { icon: UserCircle, name: 'Profile', path: '/profile' },
    { icon: Settings, name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top Navigation for Mobile */}
      <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="ml-2">
              <img 
                src="/lovable-uploads/b66cad1a-9e89-49b0-a481-bbbb0a2bbded.png" 
                alt="Trizen Logo" 
                className="h-10" 
              />
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for desktop */}
        <aside 
          className={`bg-white border-r fixed top-0 left-0 h-full shadow-sm z-40 transition-all duration-300 lg:static lg:block ${
            collapsed ? 'w-20' : 'w-64'
          } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <div className="flex flex-col h-full">
            {/* Logo Area */}
            <div className={`h-16 flex items-center px-4 border-b ${collapsed ? 'justify-center' : 'justify-between'}`}>
              {!collapsed && (
                <Link to="/" className="flex items-center">
                  <img 
                    src="/lovable-uploads/b66cad1a-9e89-49b0-a481-bbbb0a2bbded.png" 
                    alt="Trizen Logo" 
                    className="h-10" 
                  />
                </Link>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden lg:flex" 
                onClick={() => setCollapsed(!collapsed)}
              >
                <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-2">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.path}
                      className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors group"
                    >
                      <item.icon className={`h-5 w-5 text-primary ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                      {!collapsed && <span>{item.name}</span>}
                      {collapsed && (
                        <span className="absolute left-16 p-2 bg-primary text-white rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity text-sm whitespace-nowrap">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            
            {/* Logout Button */}
            <div className={`px-4 py-4 border-t ${collapsed ? 'flex justify-center' : ''}`}>
              <Button 
                variant="ghost" 
                className={`text-red-500 hover:text-red-600 hover:bg-red-50 ${collapsed ? 'p-2 w-10 h-10' : 'w-full'}`}
                onClick={handleLogout}
              >
                <LogOut className={`h-5 w-5 ${collapsed ? '' : 'mr-2'}`} />
                {!collapsed && <span>Logout</span>}
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 lg:hidden" 
            onClick={() => setMobileOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
