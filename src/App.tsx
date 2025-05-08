
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './App.css';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import ExploreCourses from './pages/ExploreCourses';
import CourseEnrollment from './pages/CourseEnrollment';
import CoursePayment from './pages/CoursePayment';
import CourseWeekView from './pages/CourseWeekView';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Assignments from './pages/Assignments';
import Discussion from './pages/Discussion';
import Calendar from './pages/Calendar';
import Grades from './pages/Grades';
import NotFound from './pages/NotFound';
import Careers from './pages/Careers';
import InternshipApply from './pages/InternshipApply';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import CourseManagement from './pages/admin/CourseManagement';
import Analytics from './pages/admin/Analytics';
import EnrollmentRequests from './pages/admin/EnrollmentRequests';

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = ['user', 'admin'] }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has the required role
  if (user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/internship/:id" element={<InternshipApply />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-courses" 
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/explore-courses" 
          element={
            <ProtectedRoute>
              <ExploreCourses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/course-enrollment" 
          element={
            <ProtectedRoute>
              <CourseEnrollment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/course-payment" 
          element={
            <ProtectedRoute>
              <CoursePayment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/course/:courseId/weeks" 
          element={
            <ProtectedRoute>
              <CourseWeekView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/course/:courseId/weeks/:weekId" 
          element={
            <ProtectedRoute>
              <CourseWeekView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/assignments" 
          element={
            <ProtectedRoute>
              <Assignments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/discussions" 
          element={
            <ProtectedRoute>
              <Discussion />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/grades" 
          element={
            <ProtectedRoute>
              <Grades />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/courses" 
          element={
            <AdminRoute>
              <CourseManagement />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/analytics" 
          element={
            <AdminRoute>
              <Analytics />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/enrollment-requests" 
          element={
            <AdminRoute>
              <EnrollmentRequests />
            </AdminRoute>
          } 
        />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
