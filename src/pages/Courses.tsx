
import React from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Users, Grid, List } from 'lucide-react';

const Courses = () => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  
  const courses = [
    {
      id: 1,
      title: "Advanced Web Technologies",
      description: "Master modern web development including React, Node.js, and cloud deployment.",
      instructor: "Dr. Sarah Johnson",
      progress: 68,
      duration: "10 weeks",
      students: 428,
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      description: "Learn the core concepts of JavaScript programming and modern ES6+ features.",
      instructor: "Prof. Michael Chen",
      progress: 42,
      duration: "6 weeks",
      students: 612,
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      title: "Data Science Basics",
      description: "Introduction to data analysis, visualization, and machine learning concepts.",
      instructor: "Dr. Emily Rodriguez",
      progress: 25,
      duration: "12 weeks",
      students: 356,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 4,
      title: "UI/UX Design Principles",
      description: "Learn to create intuitive interfaces with modern design principles and tools.",
      instructor: "Prof. David Lee",
      progress: 91,
      duration: "8 weeks",
      students: 289,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 5,
      title: "Mobile App Development",
      description: "Build cross-platform mobile applications using React Native and Firebase.",
      instructor: "Dr. Lisa Wang",
      progress: 12,
      duration: "9 weeks",
      students: 341,
      image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 6,
      title: "Cloud Computing Essentials",
      description: "Understand cloud architecture, services, and deployment strategies.",
      instructor: "Prof. James Wilson",
      progress: 0,
      duration: "8 weeks",
      students: 215,
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
  ];

  return (
    <DashboardLayout>
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
            <p className="text-muted-foreground mt-1">Manage and access your enrolled courses</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="w-10 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="w-10 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {course.image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${course.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                        {course.duration}
                      </span>
                    </div>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {course.students} students
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {course.description}
                  </p>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs">Progress</span>
                    <span className="text-xs font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-1.5" />
                </CardContent>
                <CardFooter className="pt-1 flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    {course.instructor}
                  </div>
                  <Button size="sm">
                    {course.progress > 0 ? 'Continue' : 'Start'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {course.image && (
                    <div className="relative h-32 sm:w-48 sm:h-auto overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center" 
                        style={{ backgroundImage: `url(${course.image})` }}
                      />
                    </div>
                  )}
                  <div className="flex-1 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 sm:mt-0">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> {course.students}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col flex-1 pr-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">Progress</span>
                          <span className="text-xs font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1.5" />
                      </div>
                      <Button size="sm">
                        {course.progress > 0 ? 'Continue' : 'Start'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </DashboardLayout>
  );
};

export default Courses;
