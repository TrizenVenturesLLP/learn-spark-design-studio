
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  Loader2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { 
  useCreateCourse, 
  useUpdateCourse, 
  useCourseDetails, 
  Course, 
  RoadmapDay,
  MCQQuestion
} from '@/services/courseService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import MCQForm from '@/components/MCQForm';

interface CourseFormData {
  title: string;
  description: string;
  longDescription?: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  image: string;
  courseAccess: boolean;
  skills: string[];
  roadmap: RoadmapDay[];
  instructor: string;
}

const CourseForm = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const isEditMode = !!courseId;
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  const [skill, setSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: existingCourse, isLoading: isLoadingCourse } = useCourseDetails(courseId);
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();

  const [courseData, setCourseData] = useState<CourseFormData>({
    title: '',
    description: '',
    longDescription: '',
    duration: '',
    level: 'Beginner',
    category: '',
    image: '',
    courseAccess: true,
    skills: [],
    roadmap: [{
      day: 1,
      topics: '',
      video: '',
      transcript: '',
      notes: '',
      mcqs: [] // Include MCQs in the submission
    }],
    instructor: user?.name || ''
  });

  // Load existing course data if in edit mode
  useEffect(() => {
    if (isEditMode && existingCourse) {
      setCourseData({
        title: existingCourse.title || '',
        description: existingCourse.description || '',
        longDescription: existingCourse.longDescription || '',
        duration: existingCourse.duration || '',
        level: existingCourse.level || 'Beginner',
        category: existingCourse.category || '',
        image: existingCourse.image || '',
        courseAccess: Boolean(existingCourse.courseAccess),
        skills: existingCourse.skills || [],
        roadmap: existingCourse.roadmap || [{
          day: 1,
          topics: '',
          video: '',
          transcript: '',
          notes: '',
          mcqs: []
        }],
        instructor: existingCourse.instructor || user?.name || ''
      });
    }
  }, [existingCourse, isEditMode, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate basic required fields
      if (!courseData.title.trim()) {
        throw new Error("Course title is required");
      }
      if (!courseData.description.trim()) {
        throw new Error("Course description is required");
      }
      if (!courseData.image.trim()) {
        throw new Error("Course image URL is required");
      }
      if (!courseData.duration.trim()) {
        throw new Error("Course duration is required");
      }
      if (!courseData.category) {
        throw new Error("Course category is required");
      }
      if (!courseData.instructor.trim()) {
        throw new Error("Instructor name is required");
      }

      // Validate roadmap data
      const validatedRoadmap = courseData.roadmap.map((day, index) => {
        if (!day.topics.trim()) {
          throw new Error(`Topics are required for Day ${index + 1}`);
        }
        if (!day.video.trim()) {
          throw new Error(`Video link is required for Day ${index + 1}`);
        }
        
        // Validate MCQs if they exist
        if (day.mcqs && day.mcqs.length > 0) {
          day.mcqs.forEach((mcq, mcqIndex) => {
            if (!mcq.question.trim()) {
              throw new Error(`Question is required for MCQ #${mcqIndex + 1} on Day ${index + 1}`);
            }
            
            if (!mcq.options || mcq.options.length < 2) {
              throw new Error(`At least 2 options are required for MCQ #${mcqIndex + 1} on Day ${index + 1}`);
            }
            
            const hasCorrectOption = mcq.options.some(option => option.isCorrect);
            if (!hasCorrectOption) {
              throw new Error(`At least one correct option is required for MCQ #${mcqIndex + 1} on Day ${index + 1}`);
            }
            
            mcq.options.forEach((option, optIndex) => {
              if (!option.text.trim()) {
                throw new Error(`Option text is required for option #${optIndex + 1} of MCQ #${mcqIndex + 1} on Day ${index + 1}`);
              }
            });
          });
        }
        
        return {
          day: index + 1, // Ensure days are sequential
          topics: day.topics.trim(),
          video: day.video.trim(),
          transcript: day.transcript?.trim() || '',
          notes: day.notes?.trim() || '',
          mcqs: day.mcqs || [] // Include MCQs in the submission
        };
      });

      // Format data for API
      const formattedCourseData: Partial<Course> = {
        title: courseData.title.trim(),
        description: courseData.description.trim(),
        longDescription: courseData.longDescription?.trim(),
        duration: courseData.duration.trim(),
        level: courseData.level,
        category: courseData.category,
        image: courseData.image.trim(),
        courseAccess: courseData.courseAccess,
        skills: courseData.skills,
        roadmap: validatedRoadmap,
        instructor: courseData.instructor.trim(),
        students: existingCourse?.students || 0,
        rating: existingCourse?.rating || 0,
      };

      console.log("Submitting course data:", formattedCourseData);

      if (isEditMode && courseId) {
        await updateCourseMutation.mutateAsync({
          courseId,
          courseData: formattedCourseData
        });
        toast({
          title: "Course updated",
          description: "Your course has been successfully updated.",
        });
      } else {
        await createCourseMutation.mutateAsync(formattedCourseData);
        toast({
          title: "Course created",
          description: "Your course has been successfully created.",
        });
      }
      navigate('/instructor/courses');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save course';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Course form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    if (skill.trim() && !courseData.skills.includes(skill.trim())) {
      setCourseData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
      setSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setCourseData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const addRoadmapDay = () => {
    const nextDay = courseData.roadmap.length + 1;
    setCourseData(prev => ({
      ...prev,
      roadmap: [
        ...prev.roadmap,
        {
          day: nextDay,
          topics: '',
          video: '',
          transcript: '',
          notes: '',
          mcqs: [] // Include MCQs in the submission
        }
      ]
    }));

    // Wait for the DOM to update before scrolling
    setTimeout(() => {
      const newDayElement = document.getElementById(`day-${nextDay}`);
      if (newDayElement) {
        newDayElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const updateRoadmapDay = (index: number, field: keyof RoadmapDay, value: any) => {
    setCourseData(prev => {
      const updatedRoadmap = [...prev.roadmap];
      updatedRoadmap[index] = {
        ...updatedRoadmap[index],
        [field]: value
      };
      return {
        ...prev,
        roadmap: updatedRoadmap
      };
    });
  };

  const removeRoadmapDay = (index: number) => {
    setCourseData(prev => {
      const updatedRoadmap = prev.roadmap.filter((_, i) => i !== index)
        .map((day, i) => ({ ...day, day: i + 1 }));
      return {
        ...prev,
        roadmap: updatedRoadmap
      };
    });
  };

  const handleLevelChange = (value: string) => {
    const validLevel = value as "Beginner" | "Intermediate" | "Advanced";
    setCourseData(prev => ({ ...prev, level: validLevel }));
  };

  const handleNextTab = () => {
    switch (activeTab) {
      case 'basic':
        setActiveTab('details');
        break;
      case 'details':
        setActiveTab('roadmap');
        break;
      case 'roadmap':
        setActiveTab('media');
        break;
    }
  };

  const handleMcqsUpdate = (dayIndex: number, mcqs: MCQQuestion[]) => {
    // Validate MCQs before updating
    mcqs.forEach((mcq, index) => {
      // Ensure question is not empty
      if (!mcq.question) {
        mcq.question = "";
      }
      
      // Ensure options array exists
      if (!mcq.options || !Array.isArray(mcq.options)) {
        mcq.options = [];
      }
      
      // Ensure each option has text and isCorrect properties
      mcq.options = mcq.options.map(option => ({
        text: option.text || "",
        isCorrect: Boolean(option.isCorrect)
      }));
    });
    
    updateRoadmapDay(dayIndex, 'mcqs', mcqs);
  };

  if (isLoadingCourse && isEditMode) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p>Loading course data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/instructor/courses')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
          <h1 className="text-3xl font-bold">{isEditMode ? 'Edit Course' : 'Create New Course'}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="roadmap">Course Roadmap</TabsTrigger>
            <TabsTrigger value="media">Media & Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={courseData.title}
                    onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter course title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    value={courseData.description}
                    onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description (displayed in course cards)"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Full Description</Label>
                  <Textarea
                    id="longDescription"
                    value={courseData.longDescription}
                    onChange={(e) => setCourseData(prev => ({ ...prev, longDescription: e.target.value }))}
                    placeholder="Detailed course description"
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor Name *</Label>
                    <Input
                      id="instructor"
                      value={courseData.instructor}
                      onChange={(e) => setCourseData(prev => ({ ...prev, instructor: e.target.value }))}
                      placeholder="Enter instructor name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      value={courseData.duration}
                      onChange={(e) => setCourseData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g. 30 Days, 8 Weeks"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={courseData.category}
                      onValueChange={(value) => setCourseData(prev => ({ ...prev, category: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                        <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                        <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                        <SelectItem value="Blockchain">Blockchain</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Level *</Label>
                    <Select
                      value={courseData.level}
                      onValueChange={handleLevelChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="courseAccess"
                    checked={courseData.courseAccess}
                    onCheckedChange={(checked) => 
                      setCourseData(prev => ({ ...prev, courseAccess: checked === true }))
                    }
                  />
                  <Label htmlFor="courseAccess">Make course available immediately after creation</Label>
                </div>
              </CardContent>
              <div className="flex justify-end p-6 pt-0">
                <Button type="button" onClick={handleNextTab}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Course Skills & Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Label>Skills Students Will Learn</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={skill}
                      onChange={(e) => setSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {courseData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => removeSkill(skill)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                    {courseData.skills.length === 0 && (
                      <span className="text-sm text-muted-foreground">No skills added yet</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <div className="flex justify-end p-6 pt-0">
                <Button type="button" onClick={handleNextTab}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Course Roadmap</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add and manage the daily content for your course. Each day should include topics, a video link, and an optional transcript.
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={addRoadmapDay}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Day
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {courseData.roadmap.map((day, index) => (
                  <div key={index} className="space-y-4 pb-4 border-b" id={`day-${day.day}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Day {day.day}</h3>
                      {courseData.roadmap.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeRoadmapDay(index)}
                          className="h-8 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`topics-${index}`}>Topics *</Label>
                      <Textarea
                        id={`topics-${index}`}
                        value={day.topics}
                        onChange={(e) => updateRoadmapDay(index, 'topics', e.target.value)}
                        placeholder="Topics covered on this day"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`video-${index}`}>Video Link *</Label>
                      <Input
                        id={`video-${index}`}
                        value={day.video}
                        onChange={(e) => updateRoadmapDay(index, 'video', e.target.value)}
                        placeholder="YouTube or Google Drive video link"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Supported formats: YouTube or Google Drive video links
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`transcript-${index}`}>Transcript (Optional)</Label>
                      <Textarea
                        id={`transcript-${index}`}
                        value={day.transcript || ''}
                        onChange={(e) => updateRoadmapDay(index, 'transcript', e.target.value)}
                        placeholder="Video transcript or additional notes"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`notes-${index}`}>Notes (Optional)</Label>
                      <Textarea
                        id={`notes-${index}`}
                        value={day.notes || ''}
                        onChange={(e) => updateRoadmapDay(index, 'notes', e.target.value)}
                        placeholder="Additional notes, resources, or instructions for this day"
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Add any supplementary notes, resources, or special instructions for this day's content
                      </p>
                    </div>
                    
                    {/* MCQ Form Component */}
                    <div className="mt-6">
                      <MCQForm 
                        mcqs={day.mcqs || []}
                        onChange={(mcqs) => handleMcqsUpdate(index, mcqs)}
                        dayNumber={day.day}
                      />
                    </div>
                  </div>
                ))}
                
                {courseData.roadmap.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No days added yet. Click the "Add Day" button to start building your course roadmap.</p>
                  </div>
                )}
              </CardContent>
              <div className="flex justify-end p-6 pt-0">
                <Button type="button" onClick={handleNextTab}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Media & Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Course Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={courseData.image}
                    onChange={(e) => setCourseData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Enter image URL"
                  />
                  {courseData.image && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                      <img 
                        src={courseData.image} 
                        alt="Course thumbnail preview" 
                        className="w-full max-w-md h-48 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" preserveAspectRatio="none"%3E%3Crect width="300" height="200" fill="%23CCCCCC"%3E%3C/rect%3E%3Ctext x="150" y="100" fill="%23333333" font-size="14" font-family="Arial" text-anchor="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                          toast({
                            title: "Image Error",
                            description: "The provided image URL is not valid",
                            variant: "destructive",
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
              <div className="flex justify-end p-6 pt-0 space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/instructor/courses')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditMode ? 'Update Course' : 'Create Course'}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default CourseForm;
