import React from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useEnrolledCourses } from "@/services/courseService";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { token, user } = useAuth();
  const { data: enrolledCourses, isLoading, isError } = useEnrolledCourses(token);

  const totalProgress = enrolledCourses?.length
    ? Math.round(
        enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0) / enrolledCourses.length
      )
    : 0;

  return (
    <DashboardLayout>
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome back, {user?.name || "Student"}</h1>
        <p className="text-muted-foreground mb-6">Here’s your course progress</p>

        {/* Grid Row 1: My Courses + Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Enrolled Courses Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Courses</CardTitle>
              <Button variant="link" size="sm">View All</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading && (
                <>
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-2 w-full" />
                </>
              )}
              {isError && <p className="text-red-500">Failed to load courses.</p>}
              {enrolledCourses?.map((course) => (
                <div key={course.id} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{course.title}</span>
                    <span className="text-sm text-muted-foreground">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events Card */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li>📅 Live session on React - May 8</li>
                <li>📌 Project deadline - May 10</li>
                <li>📝 Quiz on JS Basics - May 12</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Grid Row 2: Overall Progress + Assignments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Progress value={totalProgress} className="w-full h-2" />
                <span className="text-sm font-medium">{totalProgress}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Assignments Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-3">
                <li>📘 Submit Assignment 3 - Due May 9</li>
                <li>📗 Research Report Draft - Due May 11</li>
                <li>📙 Final Project Proposal - Due May 15</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </DashboardLayout>
  );
};

export default Dashboard;
