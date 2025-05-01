
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FilterableCoursesSection from "@/components/FilterableCoursesSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import CorporateTrainingSection from "@/components/CorporateTrainingSection";
import CertificationSection from "@/components/CertificationSection";
import EventsSection from "@/components/EventsSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <FilterableCoursesSection />
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
