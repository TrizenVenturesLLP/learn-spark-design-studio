
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Software Engineer, TechCorp",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "The AI certification from Trizen Training helped me transition into a machine learning role. The hands-on projects were particularly valuable."
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "DevOps Engineer, CloudTech",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "The cloud certification program gave me the skills I needed to implement scalable solutions. Within months, I received multiple job offers."
  },
  {
    id: 3,
    name: "Sarah Williams",
    role: "Data Analyst, DataInsights",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    content: "Trizen's data science course was exactly what I needed to pivot my career. The instructors are experts who provided valuable industry insights."
  }
];

const TestimonialsCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="py-16">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
        </div>

        <div className="relative max-w-4xl mx-auto px-4">
          {/* Navigation Buttons */}
          <button 
            onClick={goToPrev} 
            className="absolute top-1/2 -left-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={goToNext} 
            className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Testimonial Card */}
          <Card className="border-none shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                  <Avatar className="h-20 w-20 border-4 border-primary/20">
                    <AvatarImage src={testimonials[activeIndex].image} />
                    <AvatarFallback>{testimonials[activeIndex].name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                
                <blockquote className="text-xl italic text-gray-700 mb-6">
                  "{testimonials[activeIndex].content}"
                </blockquote>
                
                <div className="mt-4">
                  <p className="font-semibold">{testimonials[activeIndex].name}</p>
                  <p className="text-sm text-gray-500">{testimonials[activeIndex].role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Dots Navigation */}
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full ${
                  activeIndex === index ? "bg-primary" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center mt-10">
          <h3 className="text-xl font-semibold mb-4">Join Our Success Stories</h3>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
