
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import FilterableCoursesSection from '@/components/FilterableCoursesSection';

const ExploreCourses = () => {
  const navigate = useNavigate();
  
  // Handler for when a course is clicked
  const handleCourseClick = (courseId: number) => {
    navigate(`/course/${courseId}`);
  };
  
  return (
    <DashboardLayout>
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
          <p className="text-muted-foreground mt-1">Discover new courses and expand your knowledge</p>
        </div>
        
        <FilterableCoursesSection onCourseClick={handleCourseClick} />
      </main>
    </DashboardLayout>
  );
};

export default ExploreCourses;
