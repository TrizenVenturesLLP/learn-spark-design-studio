import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  BarChart2, 
  MessageSquare, 
  LogOut,
  HelpCircle,
  BookMarked,
  GraduationCap,
  FileQuestion,
  BookOpenCheck,
  ClipboardList,
  Award,
  UserCheck,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    { name: 'Assessments', href: '/instructor/assessments', icon: Award },
    { name: 'Live Sessions', href: '/instructor/sessions', icon: BookOpenCheck },
    { name: 'Messages', href: '/instructor/messages', icon: MessageSquare },
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
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 pl-64">
        <div className="h-full px-4 flex items-center justify-end space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user ? getInitials(user.name) : "IN"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/instructor/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Title Section */}
      <div className="fixed top-0 left-0 w-64 h-16 bg-primary z-50 flex items-center justify-center">
        <h1 className="text-xl font-bold text-white">Instructor Panel</h1>
      </div>

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

          {/* Signout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64 pt-16">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstructorLayout; 