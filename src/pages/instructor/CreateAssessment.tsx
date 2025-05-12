import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInstructorCourses } from '@/services/courseService';

const CreateAssessment = () => {
  const navigate = useNavigate();
  const { data: instructorCourses, isLoading: isLoadingCourses } = useInstructorCourses();
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    dueDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCourseChange = (courseId) => {
    setFormData({ ...formData, courseId });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting assessment:', formData);
    // Add API call to create assessment
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create Assessment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Course</label>
          <Select
            value={formData.courseId}
            onValueChange={handleCourseChange}
            disabled={isLoadingCourses}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {instructorCourses?.map((course) => (
                <SelectItem key={course._id || course.id} value={course._id || course.id}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Assessment title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Assessment description"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Due Date</label>
          <Input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <Button type="submit" className="w-full">Create Assessment</Button>
      </form>
    </div>
  );
};

export default CreateAssessment;
