
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Calendar, BookOpen, FileText, MessageSquare, Award, BarChart3, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const Dashboard = () => {
  const { user } = useAuth();
  
  const upcomingEvents = [
    { id: 1, title: "Web Development Lecture", date: "Today, 2:00 PM", course: "Advanced Web Tech" },
    { id: 2, title: "JavaScript Assignment Due", date: "Tomorrow, 11:59 PM", course: "JavaScript Fundamentals" },
    { id: 3, title: "Group Project Meeting", date: "May 6, 3:30 PM", course: "Team Collaboration" },
  ];
  
  const myCourses = [
    { id: 1, title: "Advanced Web Technologies", progress: 68, instructor: "Dr. Sarah Johnson" },
    { id: 2, title: "JavaScript Fundamentals", progress: 42, instructor: "Prof. Michael Chen" },
    { id: 3, title: "Data Science Basics", progress: 25, instructor: "Dr. Emily Rodriguez" },
    { id: 4, title: "UI/UX Design Principles", progress: 91, instructor: "Prof. David Lee" },
  ];
  
  const notifications = [
    { id: 1, message: "Your assignment has been graded", time: "2 hours ago", read: false },
    { id: 2, message: "New course material available", time: "Yesterday", read: true },
    { id: 3, message: "Upcoming live session reminder", time: "Yesterday", read: true },
  ];

  return (
    <DashboardLayout>
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Student'}</h1>
            <p className="text-muted-foreground mt-1">Here's an overview of your learning progress</p>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
            <Avatar className="h-10 w-10 border">
              <AvatarImage src="/lovable-uploads/b66cad1a-9e89-49b0-a481-bbbb0a2bbded.png" alt="Profile" />
              <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0) || 'S'}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* My Courses Card */}
          <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 space-y-0">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="h-5 w-5" /> My Courses
                </CardTitle>
                <CardDescription>Continue learning where you left off</CardDescription>
              </div>
              <div>
                <button className="text-sm text-primary hover:underline">View all</button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myCourses.map((course) => (
                  <div key={course.id} className="flex flex-col">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{course.title}</span>
                      <span className="text-sm text-muted-foreground">{course.progress}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={course.progress} className="h-2" />
                      <span className="text-xs text-muted-foreground">
                        Instructor: {course.instructor}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Upcoming Events Card */}
          <Card className="row-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 space-y-0">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> Upcoming Events
                </CardTitle>
                <CardDescription>Scheduled activities</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex flex-col gap-1 pb-3 border-b last:border-0">
                    <h4 className="font-semibold">{event.title}</h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> {event.date}
                    </div>
                    <div className="text-xs">{event.course}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Assignments Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 space-y-0">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Assignments
                </CardTitle>
                <CardDescription>Tasks to complete</CardDescription>
              </div>
              <div>
                <button className="text-sm text-primary hover:underline">View all</button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">JavaScript Quiz</TableCell>
                    <TableCell className="text-red-500">Today</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">CSS Layout Project</TableCell>
                    <TableCell>May 7</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">UX Research Paper</TableCell>
                    <TableCell>May 10</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Progress Tracker Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 space-y-0">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" /> Progress Tracker
                </CardTitle>
                <CardDescription>Your learning progress</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-center pb-4">
                <div className="inline-flex items-center justify-center gap-2 w-24 h-24 rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">62%</span>
                </div>
                <p className="text-sm mt-2">Overall completion</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Weekly Goals</span>
                  <span>4/5 completed</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              
              <div className="flex justify-between items-center pt-2 mt-2 border-t">
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">3 Badges Earned</span>
                </div>
                <button className="text-xs text-primary hover:underline">View all</button>
              </div>
            </CardContent>
          </Card>
          
          {/* Messages / Notifications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 space-y-0">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" /> Messages
                </CardTitle>
                <CardDescription>Recent notifications</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-2 border-l-4 rounded-sm ${notification.read ? 'border-gray-200' : 'border-primary'}`}
                  >
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                ))}
                <button className="text-xs text-primary hover:underline w-full text-center mt-2">
                  View all messages
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Dashboard;
