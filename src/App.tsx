
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import ExploreCourses from "./pages/ExploreCourses";
import CourseEnrollment from "./pages/CourseEnrollment";
import CourseWeekView from "./pages/CourseWeekView";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Grades from "./pages/Grades";
import Assignments from "./pages/Assignments";
import Calendar from "./pages/Calendar";
import Discussions from "./pages/Discussion";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Add a proper loading component
  }

  if (!isAuthenticated) {
    // Save the current location so we can redirect back after login
    localStorage.setItem('redirectPath', location.pathname);
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Check if there's a stored redirect path
    const redirectPath = localStorage.getItem('redirectPath');
    
    if (redirectPath) {
      localStorage.removeItem('redirectPath');
      return <Navigate to={redirectPath} />;
    }
    
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <PublicRoute>
                <Index />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/my-courses" element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            } />
            <Route path="/explore-courses" element={
              <ProtectedRoute>
                <ExploreCourses />
              </ProtectedRoute>
            } />
            <Route path="/course/:courseId" element={
              <ProtectedRoute>
                <CourseEnrollment />
              </ProtectedRoute>
            } />
            <Route path="/course/:courseId/weeks" element={
              <ProtectedRoute>
                <CourseWeekView />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/grades" element={
              <ProtectedRoute>
                <Grades />
              </ProtectedRoute>
            } />
            <Route path="/assignments" element={
              <ProtectedRoute>
                <Assignments />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path="/discussions" element={
              <ProtectedRoute>
                <Discussions />
              </ProtectedRoute>
            } />

            {/* Added explicit not-found-page route */}
            <Route path="/not-found-page" element={<NotFound />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Toast Notifications */}
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
