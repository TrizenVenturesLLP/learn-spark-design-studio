
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CoursePreview from "@/components/CoursePreview";
import HowItWorks from "@/components/HowItWorks";
import PlatformComparison from "@/components/PlatformComparison";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <CoursePreview />
        <HowItWorks />
        <PlatformComparison />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
