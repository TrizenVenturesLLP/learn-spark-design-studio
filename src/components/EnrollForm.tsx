import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCourseDetails, useEnrollCourse, useUpdateProgress } from '@/services/courseService';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

interface EnrollFormProps {
  courseId?: string;
}

const EnrollForm: React.FC<EnrollFormProps> = ({ courseId }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const { data: course, isLoading, isError } = useCourseDetails(courseId);
  const enrollMutation = useEnrollCourse();
  const updateProgressMutation = useUpdateProgress();
  
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enroll in this course.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: `/course/${courseId}` } });
      return;
    }
    
    // Redirect to payment form with correct path
    navigate(`/course/${courseId}/payment`);
  };

  const handleStartCourse = async () => {
    if (!token) return;
    
    try {
      await updateProgressMutation.mutateAsync({ 
        courseId: courseId!, 
        progress: 1, 
        status: 'started',
        token 
      });
      
      toast({
        title: "Course Started",
        description: "You can now access all course materials.",
      });
      
      // Redirect to my courses
      setTimeout(() => {
        navigate('/my-courses');
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not start the course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResumeCourse = () => {
    navigate('/my-courses');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Skeleton className="h-8 sm:h-12 w-3/4 mb-3 sm:mb-4" />
          <Skeleton className="h-16 sm:h-24 w-full mb-4 sm:mb-6" />
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Skeleton className="h-4 sm:h-6 w-24 sm:w-32" />
          </div>
          <Skeleton className="h-8 sm:h-10 w-28 sm:w-36 mb-3 sm:mb-4" />
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-8 sm:mb-10">
            <Skeleton className="h-4 sm:h-6 w-32 sm:w-40" />
            <Skeleton className="h-4 sm:h-6 w-36 sm:w-48" />
          </div>
          {/* Course Highlights Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 sm:h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
          <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Course Not Found</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            The course you're looking for doesn't seem to exist.
          </p>
          <Button onClick={() => navigate('/explore-courses')}>
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }
  
  // Determine button type based on enrollment status
  let actionButton;
  if (!course.enrollmentStatus) {
    actionButton = (
      <Button 
        size="lg" 
        onClick={handleEnroll} 
        className="mb-4"
        disabled={enrollMutation.isPending}
      >
        {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
      </Button>
    );
  } else if (course.enrollmentStatus === 'enrolled') {
    actionButton = (
      <Button 
        size="lg" 
        onClick={handleStartCourse} 
        className="mb-4 bg-green-600 hover:bg-green-700"
        disabled={updateProgressMutation.isPending}
      >
        {updateProgressMutation.isPending ? "Starting..." : "Start Course"}
      </Button>
    );
  } else if (course.enrollmentStatus === 'started') {
    actionButton = (
      <Button 
        size="lg" 
        onClick={handleResumeCourse} 
        className="mb-4 bg-blue-600 hover:bg-blue-700"
      >
        Resume Course
      </Button>
    );
  } else {
    actionButton = (
      <Badge className="mb-4 text-lg py-2 px-4 bg-green-600">
        Course Completed
      </Badge>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            {course?.title}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-4 sm:mb-6 max-w-3xl">
            {course?.longDescription}
          </p>
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <span className="text-sm sm:text-base text-muted-foreground">Instructor:</span>
            <span className="text-sm sm:text-base font-medium">{course?.instructor}</span>
          </div>
          
          <div className="mb-4 sm:mb-6">
            {actionButton}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <span>{course?.students?.toLocaleString()} already enrolled</span>
            <span>Included with <strong>TRIZEN Premium</strong></span>
          </div>
        </div>

        {/* Course Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm">
            <h3 className="text-sm sm:text-base font-medium mb-1">
              {course.courses?.length || 3} course series
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Get in-depth knowledge
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-yellow-500">★★★★</span><span>☆</span>
              <span className="text-sm sm:text-base font-medium">{course.rating}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              ({Math.floor(course.students / 15)} reviews)
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm">
            <h3 className="text-sm sm:text-base font-medium mb-1">
              {course.level} level
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Recommended experience
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm">
            <h3 className="text-sm sm:text-base font-medium mb-1">
              {Math.ceil(parseInt(course.duration) / 12)} months
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              at 3 hours a week
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-3 sm:p-4 shadow-sm">
            <h3 className="text-sm sm:text-base font-medium mb-1">
              Certificate
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Upon completion
            </p>
          </div>
        </div>

        {/* Course Content Preview */}
        <div className="space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
              What you'll learn
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {course.skills?.map((skill, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2 p-2 sm:p-3 rounded-md bg-muted/50"
                >
                  <span className="text-sm sm:text-base">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {course.roadmap && course.roadmap.length > 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
                Course Roadmap
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {course.roadmap.map((day, index) => (
                  <div 
                    key={index}
                    className="p-3 sm:p-4 rounded-lg border bg-card"
                  >
                    <h3 className="text-base sm:text-lg font-medium mb-2">
                      Day {index + 1}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-sm sm:text-base">Topics:</span>
                        <p className="text-sm sm:text-base text-muted-foreground">
                          {day.topics}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-sm sm:text-base">Video:</span>
                        <p className="text-sm sm:text-base text-muted-foreground">
                          {day.video}
                        </p>
                      </div>
                      {day.notes && (
                        <div className="flex items-start gap-2 mt-2 pt-2 border-t">
                          <span className="text-sm sm:text-base">Notes:</span>
                          <p className="text-sm sm:text-base text-muted-foreground">
                            {day.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for the header to avoid repetition
function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center">
        <div className="flex items-center mr-8">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/b66cad1a-9e89-49b0-a481-bbbb0a2bbded.png" 
              alt="Trizen Logo" 
              className="h-14" 
            />
          </Link>
        </div>
        <div className="flex-1 flex justify-end">
          <Link to="/explore-courses" className="text-sm font-medium hover:text-primary mr-4">
            Back to Courses
          </Link>
        </div>
      </div>
    </header>
  );
}

export default EnrollForm;
