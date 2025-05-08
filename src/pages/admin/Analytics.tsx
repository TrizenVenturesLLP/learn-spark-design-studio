
import React from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  // Mock data for charts
  const enrollmentData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 700 },
    { name: 'Jun', value: 900 },
    { name: 'Jul', value: 1000 },
  ];

  const courseCompletionData = [
    { name: 'React Basics', completed: 75, inProgress: 20, notStarted: 5 },
    { name: 'Advanced JS', completed: 60, inProgress: 30, notStarted: 10 },
    { name: 'UX Design', completed: 40, inProgress: 45, notStarted: 15 },
    { name: 'Data Science', completed: 30, inProgress: 50, notStarted: 20 },
    { name: 'Mobile Dev', completed: 50, inProgress: 35, notStarted: 15 },
  ];

  const engagementData = [
    { name: 'Week 1', hours: 12 },
    { name: 'Week 2', hours: 19 },
    { name: 'Week 3', hours: 15 },
    { name: 'Week 4', hours: 22 },
    { name: 'Week 5', hours: 18 },
    { name: 'Week 6', hours: 24 },
    { name: 'Week 7', hours: 21 },
    { name: 'Week 8', hours: 28 },
  ];

  const quizPerformanceData = [
    { name: 'Quiz 1', avgScore: 78 },
    { name: 'Quiz 2', avgScore: 82 },
    { name: 'Quiz 3', avgScore: 75 },
    { name: 'Quiz 4', avgScore: 89 },
    { name: 'Quiz 5', avgScore: 84 },
  ];

  const categoryDistributionData = [
    { name: 'Web Development', value: 35 },
    { name: 'Programming', value: 25 },
    { name: 'Design', value: 15 },
    { name: 'Data Science', value: 20 },
    { name: 'Mobile', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Analytics & Reports</h2>
        
        <Tabs defaultValue="enrollment" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-5 h-auto gap-4">
            <TabsTrigger value="enrollment">Enrollments</TabsTrigger>
            <TabsTrigger value="completion">Course Completion</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          {/* Enrollment Analytics */}
          <TabsContent value="enrollment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Enrollments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer config={{
                    value: { theme: { light: "#8b5cf6", dark: "#a78bfa" } }
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={enrollmentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip>
                          <ChartTooltipContent />
                        </ChartTooltip>
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="var(--color-value)" 
                          strokeWidth={2}
                          name="Enrollments"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Course Completion Analytics */}
          <TabsContent value="completion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Completion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer config={{
                    completed: { theme: { light: "#10b981", dark: "#34d399" } },
                    inProgress: { theme: { light: "#f59e0b", dark: "#fbbf24" } },
                    notStarted: { theme: { light: "#ef4444", dark: "#f87171" } }
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={courseCompletionData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip>
                          <ChartTooltipContent />
                        </ChartTooltip>
                        <Legend />
                        <Bar dataKey="completed" stackId="a" fill="var(--color-completed)" name="Completed" />
                        <Bar dataKey="inProgress" stackId="a" fill="var(--color-inProgress)" name="In Progress" />
                        <Bar dataKey="notStarted" stackId="a" fill="var(--color-notStarted)" name="Not Started" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Engagement Analytics */}
          <TabsContent value="engagement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Engagement (Hours Spent)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer config={{
                    hours: { theme: { light: "#6366f1", dark: "#818cf8" } }
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={engagementData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip>
                          <ChartTooltipContent />
                        </ChartTooltip>
                        <Legend />
                        <Bar dataKey="hours" fill="var(--color-hours)" name="Hours Spent" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Performance Analytics */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ChartContainer config={{
                    avgScore: { theme: { light: "#ec4899", dark: "#f472b6" } }
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={quizPerformanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <ChartTooltip>
                          <ChartTooltipContent />
                        </ChartTooltip>
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="avgScore" 
                          stroke="var(--color-avgScore)" 
                          strokeWidth={2}
                          name="Average Score (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Categories Analytics */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
