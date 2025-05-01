
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CourseCard from "./CourseCard";
import { Badge } from "@/components/ui/badge";

// Course categories
const categories = [
  { id: "all", name: "All" },
  { id: "ai", name: "AI & Machine Learning" },
  { id: "cloud", name: "Cloud & DevOps" },
  { id: "web", name: "Web & Mobile Development" },
  { id: "security", name: "Cybersecurity" },
  { id: "data", name: "Data Science" },
  { id: "soft", name: "Soft Skills & Communication" }
];

// Course data with categories
const courseData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Machine Learning Fundamentals",
    description: "Learn the foundations of machine learning algorithms and their practical applications",
    duration: "36 hours",
    rating: 4.8,
    students: 8745,
    level: "Beginner" as const,
    category: "ai"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "AWS Cloud Practitioner",
    description: "Master AWS fundamentals and prepare for the Cloud Practitioner certification",
    duration: "30 hours",
    rating: 4.9,
    students: 6521,
    level: "Beginner" as const,
    category: "cloud"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Full-Stack Web Development",
    description: "Build modern web applications with React, Node.js, and MongoDB",
    duration: "48 hours",
    rating: 4.7,
    students: 9874,
    level: "Intermediate" as const,
    category: "web"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Ethical Hacking & Penetration Testing",
    description: "Learn to identify and exploit vulnerabilities in computer systems and networks",
    duration: "42 hours",
    rating: 4.9,
    students: 5326,
    level: "Advanced" as const,
    category: "security"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Data Analysis with Python",
    description: "Explore and analyze data using Python libraries like Pandas, NumPy, and Matplotlib",
    duration: "32 hours",
    rating: 4.6,
    students: 7425,
    level: "Intermediate" as const,
    category: "data"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: "Business Communication Skills",
    description: "Develop effective communication skills for professional environments",
    duration: "24 hours",
    rating: 4.8,
    students: 4219,
    level: "Beginner" as const,
    category: "soft"
  },
];

const FilterableCoursesSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter courses based on selected category
  const filteredCourses = activeCategory === "all" 
    ? courseData 
    : courseData.filter(course => course.category === activeCategory);

  return (
    <section className="section-padding">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Explore Our Top Courses</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our most popular courses taught by industry experts and designed for real-world applications
        </p>
      </div>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(category => (
          <Badge 
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            className={`text-sm py-1 px-3 cursor-pointer ${
              activeCategory === category.id 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-primary/10"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </Badge>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button size="lg" variant="outline" className="px-8">
          View All Courses
        </Button>
      </div>
    </section>
  );
};

export default FilterableCoursesSection;
