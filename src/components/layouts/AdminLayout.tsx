import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  LogOut,
  Menu,
  ChevronLeft,
  BarChart3,
  Receipt,
  MessageSquare
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, name: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, name: 'Users', path: '/admin/users' },
    { icon: BookOpen, name: 'Courses', path: '/admin/courses' },
    { icon: Receipt, name: 'Enrollment Requests', path: '/admin/enrollment-requests' },
    { icon: MessageSquare, name: 'Contact Requests', path: '/admin/contact-requests' },
    { icon: BarChart3, name: 'Analytics', path: '/admin/analytics' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top Navigation for Mobile */}
      <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <span className="ml-2 font-bold">Admin Panel</span>
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
                <Link to="/admin/dashboard" className="flex items-center">
                  <span className="font-bold text-xl">Admin Panel</span>
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
                      className={`flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors group ${
                        isActive(item.path) ? 'bg-gray-100' : ''
                      }`}
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
            
            <div className="px-4 py-4 border-t space-y-2">
              <Link 
                to="/"
                className={`flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors w-full text-left ${collapsed ? 'justify-center' : ''}`}
              >
                <BookOpen className={`h-5 w-5 text-gray-500 ${collapsed ? '' : 'mr-3'}`} />
                {!collapsed && <span>View Site</span>}
              </Link>
              
              <Button 
                variant="ghost" 
                className={`text-red-500 hover:text-red-600 hover:bg-red-50 ${collapsed ? 'p-2 w-full justify-center' : 'w-full'}`}
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
          <div className="p-6 overflow-y-auto">
            {children}
          </div>
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

export default AdminLayout;
