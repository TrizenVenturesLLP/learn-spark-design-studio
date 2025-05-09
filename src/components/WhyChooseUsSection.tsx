
import { Award, BookOpen, Users } from "lucide-react";

const WhyChooseUsSection = () => {
  const features = [
    {
      icon: Users,
      title: "Industry-certified instructors",
      description: "Learn from experts with real-world experience in their fields."
    },
    {
      icon: BookOpen,
      title: "Hands-on projects",
      description: "Apply your knowledge with real-world projects to build your portfolio."
    },
    {
      icon: Award,
      title: "Job-oriented curriculum",
      description: "Courses designed with input from hiring managers and industry leaders."
    }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Trizen Training</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to your success with a learning experience designed to help you achieve your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center flex flex-col items-center">
              <div className="bg-lms-purple/10 p-3 rounded-full mb-5">
                <feature.icon className="h-8 w-8 text-lms-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
