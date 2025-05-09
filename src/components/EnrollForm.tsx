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
        <div className="container max-w-7xl py-8">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-24 w-full mb-6" />
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-10 w-36 mb-4" />
          <div className="flex gap-6 mb-10">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-48" />
          </div>
          {/* Course Highlights Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-10">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
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
        <div className="container max-w-7xl py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">
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
        {enrollMutation.isPending ? "Enrolling..." : "Enroll for Free"}
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

      <div className="container max-w-7xl py-8">
        {/* Hero Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4">{course?.title}</h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
            {course?.longDescription}
          </p>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-muted-foreground">Instructor:</span>
            <span className="font-medium">{course?.instructor}</span>
          </div>
          
          {actionButton}
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-muted-foreground">
            <span>{course?.students?.toLocaleString()} already enrolled</span>
            <span>Included with <strong>TRIZEN Premium</strong></span>
          </div>
        </div>

        {/* Course Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-10">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-1">{course.courses?.length || 3} course series</h3>
            <p className="text-sm text-muted-foreground">Get in-depth knowledge</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-yellow-500">★★★★</span><span>☆</span>
              <span className="font-medium">{course.rating}</span>
            </div>
            <p className="text-sm text-muted-foreground">({Math.floor(course.students / 15)} reviews)</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-1">{course.level} level</h3>
            <p className="text-sm text-muted-foreground">Recommended experience</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-1">{Math.ceil(parseInt(course.duration) / 12)} months</h3>
            <p className="text-sm text-muted-foreground">at 3 hours a week</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-1">Flexible schedule</h3>
            <p className="text-sm text-muted-foreground">Learn at your own pace</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-b mb-10">
          <nav className="flex space-x-8">
            <Link to="#about" className="py-4 px-1 font-medium border-b-2 border-primary">About</Link>
            <Link to="#outcomes" className="py-4 px-1 text-muted-foreground hover:text-foreground">Outcomes</Link>
            <Link to="#courses" className="py-4 px-1 text-muted-foreground hover:text-foreground">Courses</Link>
            <Link to="#testimonials" className="py-4 px-1 text-muted-foreground hover:text-foreground">Testimonials</Link>
          </nav>
        </div>

        {/* What You'll Learn */}
        <section id="about" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">What you'll learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="flex items-start mb-4">
                <span className="text-primary mr-2">✓</span>
                <span>Master fundamentals, best practices, and advanced techniques in {course.title}.</span>
              </p>
              <p className="flex items-start mb-4">
                <span className="text-primary mr-2">✓</span>
                <span>Build practical skills through hands-on projects and real-world applications.</span>
              </p>
            </div>
            <div>
              <p className="flex items-start mb-4">
                <span className="text-primary mr-2">✓</span>
                <span>Learn industry-standard tools and methodologies used by professionals.</span>
              </p>
              <p className="flex items-start mb-4">
                <span className="text-primary mr-2">✓</span>
                <span>Gain a competitive edge in the job market with in-demand skills and knowledge.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Skills Gained */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Skills you'll gain</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {course.skills?.map((skill) => (
              <Badge key={skill} variant="outline" className="px-3 py-1 text-sm bg-secondary/30">
                {skill}
              </Badge>
            ))}
          </div>
          <Button variant="outline" size="sm">View all skills</Button>
        </section>

        {/* Details */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Details to know</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="font-medium mb-2 text-lg">Shareable certificate</h3>
              <p className="text-muted-foreground">Add to your LinkedIn profile</p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h3 className="font-medium mb-2 text-lg">Taught in English</h3>
              <p className="text-muted-foreground">23 languages available</p>
            </div>
          </div>
        </section>

        {/* Course Series */}
        <section id="courses" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Specialization - {course.courses?.length || 3} course series</h2>
          <p className="mb-4 text-muted-foreground">
            Introducing the {course.title} Specialization, designed to empower your career 
            by providing a comprehensive skillset for success in this field.
          </p>
          <p className="mb-4 text-muted-foreground">The specialization consists of {course.courses?.length || 3} intensive courses:</p>
          
          <div className="space-y-4 mt-8">
            {course.courses?.map((course, index) => (
              <div key={index} className="bg-card border rounded-lg p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">{course.details}</p>
                </div>
                <span className="text-primary text-xl">✓</span>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Why people choose TRIZEN for their career</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course.testimonials?.map((testimonial, index) => (
              <div key={index} className="bg-card border rounded-lg p-6">
                <p className="mb-4 italic">{`"${testimonial.text}"`}</p>
                <p className="text-sm">
                  <span className="font-medium">{testimonial.author}</span>
                  {testimonial.since && <span className="text-muted-foreground ml-2">{testimonial.since}</span>}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">TRIZEN</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">About</li>
                <li className="hover:text-foreground cursor-pointer">What We Offer</li>
                <li className="hover:text-foreground cursor-pointer">Leadership</li>
                <li className="hover:text-foreground cursor-pointer">Careers</li>
                <li className="hover:text-foreground cursor-pointer">Catalog</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">Learners</li>
                <li className="hover:text-foreground cursor-pointer">Partners</li>
                <li className="hover:text-foreground cursor-pointer">Beta Testers</li>
                <li className="hover:text-foreground cursor-pointer">Blog</li>
                <li className="hover:text-foreground cursor-pointer">Teaching Center</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">More</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">Press</li>
                <li className="hover:text-foreground cursor-pointer">Investors</li>
                <li className="hover:text-foreground cursor-pointer">Terms</li>
                <li className="hover:text-foreground cursor-pointer">Privacy</li>
                <li className="hover:text-foreground cursor-pointer">Help</li>
              </ul>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mt-8">© 2025 TRIZEN Inc. All rights reserved.</p>
            </div>
          </div>
        </footer>
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
