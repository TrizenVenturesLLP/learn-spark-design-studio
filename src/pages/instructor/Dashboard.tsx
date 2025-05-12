import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Star,
  TrendingUp,
  Clock,
  MessageSquare,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileQuestion
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import InstructorProfile from '@/components/instructor/InstructorProfile';
import { useDashboardOverview } from '@/services/instructorService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading, isError } = useDashboardOverview();

  // Stats for the overview cards
  const stats = [
    { 
      title: 'Active Courses', 
      value: dashboardData ? dashboardData.activeCourses.toString() : '0', 
      icon: BookOpen,
      change: dashboardData ? (dashboardData.activeCourses > 0 ? '+' + dashboardData.activeCourses : '0') : '0' 
    },
  ];

  // Format the recent activity data from the API
  const getRecentActivities = () => {
    if (!dashboardData || !dashboardData.recentActivity) {
      return [];
    }

    return dashboardData.recentActivity.map(activity => {
      let message = '';
      if (activity.type === 'enrollment') {
        message = `New student ${activity.studentName} enrolled in ${activity.courseTitle}`;
      } else if (activity.type === 'review') {
        message = `New ${activity.rating}-star review received for ${activity.courseTitle}`;
      } else if (activity.type === 'completion') {
        message = `Student ${activity.studentName} completed ${activity.courseTitle}`;
      }

      return {
        type: activity.type,
        message,
        time: formatDistanceToNow(new Date(activity.date), { addSuffix: true })
      };
    });
  };

  const recentActivities = getRecentActivities();

  // Mock data for upcoming sessions - this could be replaced with real data in the future
  const upcomingSessions = [
    { title: 'Web Development Q&A', time: 'Today, 2:00 PM', students: 45 },
    { title: 'Data Science Workshop', time: 'Tomorrow, 10:00 AM', students: 32 },
  ];

  // New mock data for pending assessments
  const pendingAssessments = dashboardData?.pendingAssessments || [
    { title: 'JavaScript Fundamentals Quiz', dueDate: '2025-05-20', submissions: 12, total: 30 },
    { title: 'React Component Challenge', dueDate: '2025-05-25', submissions: 5, total: 25 },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading dashboard data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-destructive">
        <AlertCircle className="w-12 h-12 mb-2" />
        <h2 className="text-xl font-semibold">Error Loading Dashboard</h2>
        <p>There was a problem loading your dashboard data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Session
          </Button>
          <Button variant="outline" onClick={() => navigate('/instructor/assessments')}>
            <FileQuestion className="w-4 h-4 mr-2" />
            Create Assessment
          </Button>
          <Button onClick={() => navigate('/instructor/courses/new')}>
            <BookOpen className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Instructor Profile */}
      <InstructorProfile />
      
      <h2 className="text-xl font-semibold mt-6">Overview</h2>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Courses ({dashboardData?.activeCourses || 0})
            </CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {dashboardData && dashboardData.courseBreakdown && dashboardData.courseBreakdown.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.courseBreakdown.map(course => (
                  <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{course.title}</h3>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Users className="w-3 h-3 mr-1" />
                        <span>{course.students} enrolled</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground py-4">No active courses</p>
            )}
          </CardContent>
        </Card>

        {/* New Card for Pending Assessments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Assessments
            </CardTitle>
            <FileQuestion className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {pendingAssessments && pendingAssessments.length > 0 ? (
              <div className="space-y-3">
                {pendingAssessments.map((assessment, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{assessment.title}</h3>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>Due {new Date(assessment.dueDate).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <Users className="w-3 h-3 mr-1" />
                        <span>{assessment.submissions}/{assessment.total} submissions</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/instructor/assessments')}>
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground py-4">No pending assessments</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Course Completion Rates</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData && dashboardData.completionRates && dashboardData.completionRates.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.completionRates.map(course => (
                  <div key={course.courseId} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{course.courseTitle}</span>
                      <span>{course.completionRate}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${course.completionRate}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{course.completions} completions</span>
                      <span>{course.totalEnrollments} enrollments</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center border rounded-lg">
                <p className="text-muted-foreground">No course completion data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="mt-1">
                      {activity.type === 'enrollment' && <Users className="w-4 h-4 text-blue-500" />}
                      {activity.type === 'review' && <Star className="w-4 h-4 text-yellow-500" />}
                      {activity.type === 'completion' && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <div>
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Live Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">{session.time}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-1" />
                      {session.students} students
                    </div>
                    <Button variant="outline" size="sm">
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Course Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData && dashboardData.courseBreakdown ? (
                dashboardData.courseBreakdown.map(course => (
                  <div key={course.id} className="p-3 border rounded-lg">
                    <h3 className="font-medium">{course.title}</h3>
                    <div className="flex items-center mt-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground mr-1" />
                      <span>{course.students} students</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No courses available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
