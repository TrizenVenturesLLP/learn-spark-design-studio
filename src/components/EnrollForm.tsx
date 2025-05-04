
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface EnrollFormProps {
  courseId?: string;
}

const EnrollForm: React.FC<EnrollFormProps> = ({ courseId }) => {
  const { toast } = useToast();
  
  const handleEnroll = () => {
    toast({
      title: "Enrollment Successful!",
      description: "You have successfully enrolled in this course.",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header Navigation */}
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

      <div className="container max-w-7xl py-8">
        {/* Hero Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4">Java FullStack Developer Specialization</h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
            Develop Dynamic Web Applications with Java. Master Java programming, Angular for responsive front-end web development, 
            and Spring and Spring Boot for robust back-end systems, culminating in a comprehensive skillset to build, integrate, 
            and deploy cloud ready web applications.
          </p>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-muted-foreground">Instructor:</span>
            <span className="font-medium">Board Infinity</span>
          </div>
          <Button size="lg" onClick={handleEnroll} className="mb-4">
            Enroll for Free
          </Button>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-muted-foreground">
            <span>24,220 already enrolled</span>
            <span>Included with <strong>TRIZEN Premium</strong></span>
          </div>
        </div>

        {/* Course Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-10">
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-1">3 course series</h3>
            <p className="text-sm text-muted-foreground">Get in-depth knowledge</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-yellow-500">★★★★</span><span>☆</span>
              <span className="font-medium">4.3</span>
            </div>
            <p className="text-sm text-muted-foreground">(482 reviews)</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-1">Intermediate level</h3>
            <p className="text-sm text-muted-foreground">Recommended experience</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-1">3 months</h3>
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
                <span>Master Java fundamentals, object-oriented programming, data structures, and algorithms to write effective, efficient code.</span>
              </p>
              <p className="flex items-start mb-4">
                <span className="text-primary mr-2">✓</span>
                <span>Delve into building robust and scalable backend systems using Spring and Spring Boot. Learn how to develop RESTful web services.</span>
              </p>
            </div>
            <div>
              <p className="flex items-start mb-4">
                <span className="text-primary mr-2">✓</span>
                <span>Leverage Angular for front-end web development. Acquire skills to design, develop, and deploy complex, dynamic, and responsive web applications.</span>
              </p>
              <p className="flex items-start mb-4">
                <span className="text-primary mr-2">✓</span>
                <span>Benefit from hands-on learning, applying skills to real-world scenarios to create, integrate, and deploy cloud-ready applications.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Skills Gained */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Skills you'll gain</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {["Spring", "Object-Oriented Programming (OOP)", "Cascading Style Sheets (CSS)", 
              "Data Structure", "JPA", "HTML", "Angular.js", "Hibernate", 
              "Java Programming", "JavaScript", "Spring Boot", "Model View Controller"].map((skill) => (
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
          <h2 className="text-2xl font-bold mb-6">Specialization - 3 course series</h2>
          <p className="mb-4 text-muted-foreground">
            Introducing the Java FullStack Developer Specialization, designed to empower your software development career 
            by providing a comprehensive skillset for building integrated, cloud-ready web applications.
          </p>
          <p className="mb-4 text-muted-foreground">The specialization consists of three intensive courses:</p>
          
          <div className="space-y-4 mt-8">
            {[
              {
                title: "Fundamentals of Java Programming",
                details: "Course 1 • 17 hours • 4.4 ★ (488 ratings)"
              },
              {
                title: "Frontend for Java Full Stack Development",
                details: "Course 2 • 24 hours • 4.2 ★ (76 ratings)"
              },
              {
                title: "Data Structures & Backend with Java",
                details: "Course 3 • 19 hours • 4.2 ★ (98 ratings)"
              }
            ].map((course, index) => (
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
            {[
              {
                text: "To be able to take courses at my own pace and rhythm has been an amazing experience, I can learn whenever it fits my schedule and mood.",
                author: "Felipe M.",
                since: "Learner since 2018"
              },
              {
                text: "I directly applied the concepts and skills I learned from my courses to an exciting new project at work.",
                author: "Jennifer J.",
                since: "Learner since 2020"
              },
              {
                text: "When I need courses on topics that my university doesn't offer, TRIZEN is one of the best places to go.",
                author: "Larry W.",
                since: "Learner since 2021"
              },
              {
                text: "Learning isn't just about being better at your job; it's so much more than that. TRIZEN allows me to learn without limits.",
                author: "Chaitanya A.",
                since: ""
              }
            ].map((testimonial, index) => (
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

export default EnrollForm;
