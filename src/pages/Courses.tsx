import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/CourseCard";
import { useEnrolledCourses, useUpdateProgress } from '@/services/courseService';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const Courses = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();
  const { data: enrolledCourses, isLoading, isError } = useEnrolledCourses(token);
  const updateProgressMutation = useUpdateProgress();
  
  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}/weeks`);  // Updated to navigate to week view
  };
  
  const handleExploreCoursesClick = () => {
    navigate('/explore-courses');
  };
  
  const handleStartClick = async (courseId: string) => {
    if (!token) return;
    
    try {
      await updateProgressMutation.mutateAsync({ 
        courseId, 
        progress: 1, 
        status: 'started',
        token 
      });
      
      navigate(`/course/${courseId}/weeks`);  // Updated to navigate to week view
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not start the course. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleResumeClick = (courseId: string) => {
    navigate(`/course/${courseId}/weeks`);  // Updated to navigate to week view
  };
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-md" />
            ))}
          </div>
        </main>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground mt-1">Continue your learning journey</p>
        </div>
        
        {!enrolledCourses || enrolledCourses.length === 0 ? (
          <div className="text-center py-12 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-2">You haven't enrolled in any courses yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Explore our catalog and find courses that match your interests and career goals
            </p>
            <Button onClick={handleExploreCoursesClick}>
              Explore Courses
            </Button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">In Progress</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {enrolledCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  id={course._id}
                  image={course.image}
                  title={course.title}
                  description={course.description}
                  duration={course.duration}
                  rating={course.rating}
                  students={course.students}
                  level={course.level}
                  progress={course.progress}
                  instructor={course.instructor}
                  enrollmentStatus={course.status as 'enrolled' | 'started' | 'completed'}
                  onClick={() => handleCourseClick(course._id)}
                  onStartClick={course.status === 'enrolled' ? () => handleStartClick(course._id) : undefined}
                  onResumeClick={course.status === 'started' ? () => handleResumeClick(course._id) : undefined}
                />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline" onClick={handleExploreCoursesClick}>
                Discover More Courses
              </Button>
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
};

export default Courses;
