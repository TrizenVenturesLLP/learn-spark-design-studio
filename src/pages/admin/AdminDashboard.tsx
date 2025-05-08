
import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  BookOpen, 
  UserCheck, 
  UserX, 
  TrendingUp 
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  // Mock data - in a real app this would come from API calls
  const [stats] = useState({
    totalLearners: 1245,
    totalCourses: 42,
    activeUsers: 876,
    inactiveUsers: 369,
    enrollments: {
      daily: 24,
      weekly: 187,
      monthly: 743
    }
  });

  const [recentActivities] = useState([
    { id: 1, user: "John Doe", action: "Enrolled in React Fundamentals", time: "2 hours ago" },
    { id: 2, user: "Sarah Smith", action: "Completed JavaScript Basics", time: "4 hours ago" },
    { id: 3, user: "Mike Johnson", action: "Submitted support ticket", time: "5 hours ago" },
    { id: 4, user: "Emily Brown", action: "Updated profile", time: "1 day ago" },
    { id: 5, user: "Alex Wilson", action: "Requested course access", time: "1 day ago" },
  ]);

  const [enrollmentData] = useState([
    { name: 'Jan', enrollments: 400 },
    { name: 'Feb', enrollments: 300 },
    { name: 'Mar', enrollments: 600 },
    { name: 'Apr', enrollments: 800 },
    { name: 'May', enrollments: 700 },
    { name: 'Jun', enrollments: 900 },
    { name: 'Jul', enrollments: 1000 },
  ]);

  const statCards = [
    { title: "Total Learners", value: stats.totalLearners, icon: Users, color: "bg-blue-100 text-blue-600" },
    { title: "Total Courses", value: stats.totalCourses, icon: BookOpen, color: "bg-green-100 text-green-600" },
    { title: "Active Users", value: stats.activeUsers, icon: UserCheck, color: "bg-purple-100 text-purple-600" },
    { title: "Inactive Users", value: stats.inactiveUsers, icon: UserX, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => (
            <Card key={index}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className={`p-2.5 rounded-full ${card.color}`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <h3 className="text-2xl font-bold">{card.value.toLocaleString()}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Enrollment Chart */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                Enrollment Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer config={{
                  enrollments: { theme: { light: "#8b5cf6", dark: "#a78bfa" } }
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={enrollmentData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="enrollments" 
                        stroke="var(--color-enrollments)" 
                        fillOpacity={0.3} 
                        fill="url(#colorEnrollments)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">Daily</p>
                  <p className="font-bold">{stats.enrollments.daily}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">Weekly</p>
                  <p className="font-bold">{stats.enrollments.weekly}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <p className="text-xs text-muted-foreground">Monthly</p>
                  <p className="font-bold">{stats.enrollments.monthly}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.user}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{activity.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
