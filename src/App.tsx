
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Index as HomePage } from './pages/Index';
import CourseDetailsPage from './pages/CourseDetailsPage';
import MyCoursesPage from './pages/MyCoursesPage';
import EnrollmentRequestPage from './pages/EnrollmentRequestPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEnrollmentRequests from './pages/admin/EnrollmentRequests';
import InstructorLayout from './components/layouts/InstructorLayout';
import InstructorDashboard from './pages/instructor/Dashboard';
import InstructorCourses from './pages/instructor/Courses';
import InstructorStudents from './pages/instructor/Students';
import InstructorMessages from './pages/instructor/Messages';
import InstructorSettings from './pages/instructor/Settings';
import InstructorGuidelinesPage from './pages/instructor/InstructorGuidelinesPage';
import TeachingResources from './pages/instructor/TeachingResources';
import FAQ from './pages/instructor/FAQ';
import Support from './pages/instructor/Support';
import StudentProgress from './pages/instructor/StudentProgress';
import AssignmentSubmissions from './pages/instructor/AssignmentSubmissions';
import StudentCertificates from './pages/instructor/StudentCertificates';
import StudentAttendance from './pages/instructor/Attendance';
import NewCoursePage from './pages/instructor/NewCoursePage';
import EditCoursePage from './pages/instructor/EditCoursePage';
import CourseContentPage from './pages/instructor/CourseContent';
import AssessmentsList from './pages/instructor/AssessmentsList';
import CreateAssessment from './pages/instructor/CreateAssessment';
import ViewAssessment from './pages/instructor/ViewAssessment';
import EditAssessment from './pages/instructor/EditAssessment';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
        <Route path="/my-courses" element={<MyCoursesPage />} />
        <Route path="/enrollment-request" element={<EnrollmentRequestPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/enrollment-requests" element={<AdminEnrollmentRequests />} />

        {/* Instructor Routes */}
        <Route path="/instructor" element={<InstructorLayout />}>
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="courses" element={<InstructorCourses />} />
          <Route path="courses/new" element={<NewCoursePage />} />
          <Route path="courses/:courseId/edit" element={<EditCoursePage />} />
          <Route path="courses/:courseId/content" element={<CourseContentPage />} />
          <Route path="students" element={<InstructorStudents />} />
          <Route path="messages" element={<InstructorMessages />} />
          <Route path="settings" element={<InstructorSettings />} />
          <Route path="guidelines" element={<InstructorGuidelinesPage />} />
          <Route path="teaching-resources" element={<TeachingResources />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="support" element={<Support />} />
          <Route path="student-progress" element={<StudentProgress />} />
          <Route path="assignments" element={<AssignmentSubmissions />} />
          <Route path="certificates" element={<StudentCertificates />} />
          <Route path="attendance" element={<StudentAttendance />} />
          
          {/* Assessment Routes */}
          <Route path="assessments" element={<AssessmentsList />} />
          <Route path="courses/:courseId/create-assessment" element={<CreateAssessment />} />
          <Route path="assessments/:assessmentId" element={<ViewAssessment />} />
          <Route path="assessments/:assessmentId/edit" element={<EditAssessment />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
