
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FilterableCoursesSection from "@/components/FilterableCoursesSection";
import CoursePreview from "@/components/CoursePreview";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import CorporateTrainingSection from "@/components/CorporateTrainingSection";
import CertificationSection from "@/components/CertificationSection";
import EventsSection from "@/components/EventsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import { useAllCourses } from "@/services/courseService";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { data: courses } = useAllCourses();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };
  
  const handleEnrollClick = (courseId: string) => {
    // For the index page, we'll redirect to login if needed before enrollment
    navigate('/login', { state: { from: `/?courseId=${courseId}` } });
  };
  
  // These are placeholder functions since they won't be used on the index page
  // Courses on the index page will not have started or in-progress status
  const handleStartClick = (courseId: string) => {
    navigate('/login', { state: { from: `/course/${courseId}` } });
  };
  
  const handleResumeClick = (courseId: string) => {
    navigate('/login', { state: { from: `/course/${courseId}` } });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        {/* <CoursePreview /> */}
        <FilterableCoursesSection 
          courses={courses || []} 
          onCourseClick={handleCourseClick}
          onEnrollClick={handleEnrollClick}
          onStartClick={handleStartClick}
          onResumeClick={handleResumeClick}
        />
        <WhyChooseUsSection />
        <TestimonialsCarousel />
        <CorporateTrainingSection />
        <CertificationSection />
        <EventsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
