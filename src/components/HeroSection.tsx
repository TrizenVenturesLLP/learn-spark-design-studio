
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-blue-50">
      <div className="section-padding flex flex-col lg:flex-row items-center gap-8 py-20">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Learn. Upgrade. <span className="gradient-text">Succeed.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
            Access high-quality training videos & live classes anytime. Designed for beginners and professionals alike.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="text-md px-6">
              Browse Courses
            </Button>
            <Button variant="outline" size="lg" className="text-md px-6">
              Join Live Session
            </Button>
          </div>
        </div>
        
        <div className="flex-1 relative lg:h-[500px] w-full">
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Online learning" 
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default HeroSection;
