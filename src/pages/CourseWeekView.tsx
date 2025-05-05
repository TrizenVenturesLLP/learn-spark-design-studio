
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import CourseWeeklySidebar from '@/components/CourseWeeklySidebar';
import CourseModuleContent from '@/components/CourseModuleContent';
import CourseProgressTracker from '@/components/CourseProgressTracker';
import { useCourseDetails, useUpdateProgress } from '@/services/courseService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import courseWeekData, { WeekData } from '@/data/courseWeekData';

const CourseWeekView = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { token } = useAuth();
  const { toast } = useToast();
  const { data: courseDetails, isLoading } = useCourseDetails(courseId);
  const updateProgressMutation = useUpdateProgress();
  
  const [selectedWeek, setSelectedWeek] = useState<string>('week1');
  const [weekData, setWeekData] = useState<Record<string, WeekData>>(courseWeekData);
  const [learningGoal, setLearningGoal] = useState<number>(5);
  const [weekProgress, setWeekProgress] = useState({
    m: false, t: false, w: false, th: false, f: false, s: false, su: false
  });
  
  // Handle week selection
  const handleWeekSelect = (weekId: string) => {
    setSelectedWeek(weekId);
  };
  
  // Mark lecture as complete or incomplete
  const markLectureComplete = (weekId: string, moduleId: string, lectureId: string) => {
    const updatedWeekData = { ...weekData };
    const moduleIndex = updatedWeekData[weekId].modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;
    
    const lectureIndex = updatedWeekData[weekId].modules[moduleIndex].lectures.findIndex(l => l.id === lectureId);
    if (lectureIndex === -1) return;
    
    // Toggle completion status
    const newCompletionStatus = !updatedWeekData[weekId].modules[moduleIndex].lectures[lectureIndex].completed;
    updatedWeekData[weekId].modules[moduleIndex].lectures[lectureIndex].completed = newCompletionStatus;
    
    // Update module progress (videosLeft, readingsLeft, assessmentsLeft)
    const lecture = updatedWeekData[weekId].modules[moduleIndex].lectures[lectureIndex];
    if (newCompletionStatus) {
      // Decrease the count if it's marked as completed
      if (lecture.type === 'video') {
        updatedWeekData[weekId].modules[moduleIndex].videosLeft -= parseInt(lecture.duration.split(' ')[0]);
      } else if (lecture.type === 'reading') {
        updatedWeekData[weekId].modules[moduleIndex].readingsLeft -= parseInt(lecture.duration.split(' ')[0]);
      } else if (lecture.type === 'quiz') {
        updatedWeekData[weekId].modules[moduleIndex].assessmentsLeft -= 1;
      }
    } else {
      // Increase the count if it's marked as incomplete
      if (lecture.type === 'video') {
        updatedWeekData[weekId].modules[moduleIndex].videosLeft += parseInt(lecture.duration.split(' ')[0]);
      } else if (lecture.type === 'reading') {
        updatedWeekData[weekId].modules[moduleIndex].readingsLeft += parseInt(lecture.duration.split(' ')[0]);
      } else if (lecture.type === 'quiz') {
        updatedWeekData[weekId].modules[moduleIndex].assessmentsLeft += 1;
      }
    }
    
    setWeekData(updatedWeekData);
    
    // Calculate course progress percentage based on completed lectures
    if (courseId && token) {
      const totalLectures = Object.values(weekData).flatMap(week => 
        week.modules.flatMap(module => module.lectures)
      ).length;
      
      const completedLectures = Object.values(updatedWeekData).flatMap(week => 
        week.modules.flatMap(module => module.lectures.filter(lecture => lecture.completed))
      ).length;
      
      const progressPercentage = Math.round((completedLectures / totalLectures) * 100);
      
      // Update course progress in the database
      updateProgressMutation.mutate({ 
        courseId, 
        progress: progressPercentage,
        token
      });
    }
  };
  
  // Toggle module expansion
  const toggleModuleExpansion = (weekId: string, moduleId: string) => {
    const updatedWeekData = { ...weekData };
    const moduleIndex = updatedWeekData[weekId].modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;
    
    updatedWeekData[weekId].modules[moduleIndex].expanded = !updatedWeekData[weekId].modules[moduleIndex].expanded;
    setWeekData(updatedWeekData);
  };
  
  // Toggle week completion status
  const toggleWeekComplete = (weekId: string) => {
    const updatedWeekData = { ...weekData };
    updatedWeekData[weekId].completed = !updatedWeekData[weekId].completed;
    setWeekData(updatedWeekData);
    
    // If all weeks are completed, mark the course as completed
    const allWeeksCompleted = Object.values(updatedWeekData).every(week => week.completed);
    
    if (courseId && token && allWeeksCompleted) {
      updateProgressMutation.mutate({ 
        courseId, 
        progress: 100,
        status: 'completed',
        token
      });
      
      toast({
        title: "Course Completed! 🎉",
        description: "Congratulations on completing this course!",
      });
    }
  };
  
  // Toggle day progress
  const toggleDayProgress = (day: string) => {
    setWeekProgress(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };
  
  // Calculate overall course progress
  const calculateCourseProgress = (): number => {
    const totalLectures = Object.values(weekData).flatMap(week => 
      week.modules.flatMap(module => module.lectures)
    ).length;
    
    const completedLectures = Object.values(weekData).flatMap(week => 
      week.modules.flatMap(module => module.lectures.filter(lecture => lecture.completed))
    ).length;
    
    return Math.round((completedLectures / totalLectures) * 100);
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        {/* Left Sidebar with weeks list */}
        <CourseWeeklySidebar 
          weekData={weekData} 
          selectedWeek={selectedWeek}
          onWeekSelect={handleWeekSelect}
          courseTitle={courseDetails?.title || "Course Content"}
          instructor={courseDetails?.instructor || "Instructor"}
        />
        
        {/* Main content area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Course header with title and progress */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">{weekData[selectedWeek]?.title || "Week Content"}</h1>
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Course Progress</span>
                <span>{calculateCourseProgress()}%</span>
              </div>
              <Progress value={calculateCourseProgress()} className="h-2" />
            </div>
          </div>
          
          {/* Module content */}
          {weekData[selectedWeek]?.modules.map(module => (
            <CourseModuleContent
              key={module.id}
              module={module}
              weekId={selectedWeek}
              onLectureComplete={(lectureId) => markLectureComplete(selectedWeek, module.id, lectureId)}
              onToggleExpansion={() => toggleModuleExpansion(selectedWeek, module.id)}
            />
          ))}
          
          {/* Week completion button */}
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => toggleWeekComplete(selectedWeek)}
              className={`px-6 ${
                weekData[selectedWeek]?.completed 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {weekData[selectedWeek]?.completed ? "✓ Week Completed" : "Mark Week as Complete"}
            </Button>
          </div>
        </div>
        
        {/* Right sidebar with progress tracker */}
        <CourseProgressTracker
          weekProgress={weekProgress}
          learningGoal={learningGoal}
          onDayToggle={toggleDayProgress}
          onGoalChange={setLearningGoal}
          courseDetails={courseDetails}
        />
      </div>
    </DashboardLayout>
  );
};

export default CourseWeekView;
