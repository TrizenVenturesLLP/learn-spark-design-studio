import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  BarChart2, 
  MessageSquare, 
  Settings, 
  FileText,
  Calendar,
  Star,
  LogOut,
  HelpCircle,
  BookMarked,
  GraduationCap,
  FileQuestion,
  BookOpenCheck,
  ClipboardList,
  Award,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const InstructorLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/instructor/dashboard', icon: BarChart2 },
    { name: 'Courses', href: '/instructor/courses', icon: BookOpen },
    { name: 'Students', href: '/instructor/students', icon: Users },
    { name: 'Assessments', href: '/instructor/assessments', icon: Star },
    { name: 'Live Sessions', href: '/instructor/sessions', icon: Calendar },
    { name: 'Messages', href: '/instructor/messages', icon: MessageSquare },
    { name: 'Settings', href: '/instructor/settings', icon: Settings },
  ];

  const staticPages = [
    { name: 'Instructor Guidelines', href: '/instructor/guidelines', icon: BookMarked },
    { name: 'Teaching Resources', href: '/instructor/teaching-resources', icon: GraduationCap },
    { name: 'FAQ', href: '/instructor/faq', icon: HelpCircle },
    { name: 'Support', href: '/instructor/support', icon: FileQuestion },
  ];

  const studentContentPages = [
    { name: 'Student Progress', href: '/instructor/student-progress', icon: BookOpenCheck },
    { name: 'Assignment Submissions', href: '/instructor/assignments', icon: ClipboardList },
    { name: 'Student Certificates', href: '/instructor/certificates', icon: Award },
    { name: 'Student Attendance', href: '/instructor/attendance', icon: UserCheck },
  ];

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-primary">
            <h1 className="text-xl font-bold text-white">Instructor Portal</h1>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <div className="mb-4">
              <h2 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main Menu
              </h2>
              <div className="mt-2 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Student Content Pages */}
            <div className="mt-6">
              <h2 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Student Content
              </h2>
              <div className="mt-2 space-y-1">
                {studentContentPages.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Static Pages */}
            <div className="mt-6">
              <h2 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Resources & Support
              </h2>
              <div className="mt-2 space-y-1">
                {staticPages.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div
                className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center"
                aria-label="Profile"
              >
                <span className="text-sm font-medium">{user ? getInitials(user.name) : "IN"}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name || "Instructor"}</p>
                <p className="text-xs text-gray-500">Instructor</p>
              </div>
            </div>
            
            {/* Logout Button */}
            <Button 
              variant="ghost" 
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout; 