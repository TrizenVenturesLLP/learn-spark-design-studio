
import { Button } from "@/components/ui/button";
import { LayoutGrid, BarChart, Zap } from "lucide-react";

const CorporateTrainingSection = () => {
  const features = [
    {
      icon: LayoutGrid,
      title: "Customized Team Training",
      description: "Tailored programs designed specifically for your team's needs"
    },
    {
      icon: Zap,
      title: "LMS Integration",
      description: "Seamlessly integrate with your existing learning management system"
    },
    {
      icon: BarChart,
      title: "Progress Tracking",
      description: "Monitor team performance and learning outcomes"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Corporate & Institutional Training</h2>
            <p className="text-lg text-gray-600 mb-8">
              Invest in your team's growth with customized training programs tailored to your organization's specific needs and goals.
            </p>
            
            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button size="lg" className="mt-2">Upskill Your Team</Button>
          </div>
          
          <div className="relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-center">Corporate Training</h3>
              <img 
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Corporate training" 
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <div className="text-center">
                <Button size="lg" className="mt-2 w-full">Get Started</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateTrainingSection;
