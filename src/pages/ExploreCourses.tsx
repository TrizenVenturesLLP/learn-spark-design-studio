
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import FilterableCoursesSection from '@/components/FilterableCoursesSection';
import { useAllCourses } from '@/services/courseService';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button'; // Added Button import

const ExploreCourses = () => {
  const navigate = useNavigate();
  const { data: courses, isLoading, isError } = useAllCourses();
  
  // Handler for when a course is clicked
  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-32" />
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-md" />
            ))}
          </div>
        </main>
      </DashboardLayout>
    );
  }
  
  if (isError) {
    return (
      <DashboardLayout>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
            <p className="text-muted-foreground mb-6">We couldn't load the courses. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>Refresh</Button>
          </div>
        </main>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
          <p className="text-muted-foreground mt-1">Discover new courses and expand your knowledge</p>
        </div>
        
        <FilterableCoursesSection 
          courses={courses || []} 
          onCourseClick={handleCourseClick} 
        />
      </main>
    </DashboardLayout>
  );
};

export default ExploreCourses;
