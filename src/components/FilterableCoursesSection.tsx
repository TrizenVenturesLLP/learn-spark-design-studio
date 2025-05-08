
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from './CourseCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface FilterableCoursesSectionProps {
  courses: any[];
  onCourseClick: (courseId: string) => void;
  onEnrollClick: (courseId: string) => void;
  onStartClick: (courseId: string) => void;
  onResumeClick: (courseId: string) => void;
}

const FilterableCoursesSection: React.FC<FilterableCoursesSectionProps> = ({
  courses,
  onCourseClick,
  onEnrollClick,
  onStartClick,
  onResumeClick
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Extract unique levels and categories
  const levels = [...new Set(courses.map(course => course.level))];
  const categories = [...new Set(courses.map(course => course.category))];
  
  // Handle enrollment navigation to payment form
  const handleEnrollClick = (courseId: string) => {
    const course = courses.find(c => c._id === courseId);
    if (course) {
      navigate('/course-enrollment', { state: { course } });
    } else {
      onEnrollClick(courseId);
    }
  };
  
  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm === '' || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === null || course.level === selectedLevel;
    const matchesCategory = selectedCategory === null || course.category === selectedCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });
  
  return (
    <div>
      {/* Search and filters */}
      <div className="mb-8 space-y-4">
        <Input
          type="text"
          placeholder="Search courses..."
          className="max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Level</h3>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedLevel === null ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedLevel(null)}
            >
              All Levels
            </Badge>
            {levels.map(level => (
              <Badge
                key={level}
                variant={selectedLevel === level ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedLevel(level === selectedLevel ? null : level)}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Category</h3>
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedCategory === null ? "secondary" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Badge>
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "secondary" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      
      {/* Course grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              id={course._id}
              image={course.image}
              title={course.title}
              description={course.description}
              duration={course.duration}
              rating={course.rating}
              students={course.students}
              level={course.level}
              progress={course.progress}
              instructor={course.instructor}
              enrollmentStatus={course.enrollmentStatus}
              onClick={() => onCourseClick(course._id)}
              onEnrollClick={() => handleEnrollClick(course._id)}
              onStartClick={course.enrollmentStatus === 'enrolled' ? () => onStartClick(course._id) : undefined}
              onResumeClick={course.enrollmentStatus === 'started' ? () => onResumeClick(course._id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterableCoursesSection;
