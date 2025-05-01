
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award, Rocket } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Self-paced Courses",
      description: "Learn at your own pace with on-demand content"
    },
    {
      icon: Users,
      title: "Live Training",
      description: "Interactive sessions with industry experts"
    },
    {
      icon: Award,
      title: "Certifications",
      description: "Industry-recognized credentials"
    },
    {
      icon: Rocket,
      title: "Workshops",
      description: "Hands-on learning experiences"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">About Trizen Training</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At Trizen Training, we're committed to empowering individuals and organizations with in-demand skills that 
            drive innovation and professional growth. Our cutting-edge curriculum is designed in collaboration with 
            industry experts to ensure you're learning what matters most in today's job market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Courses and Certifications</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Explore our comprehensive range of courses designed to help you master in-demand skills and advance your career.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
