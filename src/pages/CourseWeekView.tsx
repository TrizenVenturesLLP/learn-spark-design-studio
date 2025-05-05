import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import CourseWeeklySidebar from '@/components/CourseWeeklySidebar';
import CourseModuleContent from '@/components/CourseModuleContent';
import CourseProgressTracker from '@/components/CourseProgressTracker';
import { useCourseDetails, useUpdateProgress } from '@/services/courseService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import courseWeekData, { WeekData } from '@/data/courseWeekData';

type WeekProgress = {
  m: boolean;
  t: boolean;
  w: boolean;
  th: boolean;
  f: boolean;
  s: boolean;
  su: boolean;
};

// Custom useMediaQuery hook implementation
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    const updateMatches = () => setMatches(media.matches);
    updateMatches(); // Initialize
    
    media.addEventListener('change', updateMatches);
    return () => media.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
};

const CourseWeekView = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { token } = useAuth();
  const { toast } = useToast();
  const { data: courseDetails, isLoading } = useCourseDetails(courseId);
  const updateProgressMutation = useUpdateProgress();
  const isLargeScreen = useMediaQuery('(min-width: 1400px)'); // 1400px breakpoint
  
  const [selectedWeek, setSelectedWeek] = useState<string>('week1');
  const [weekData, setWeekData] = useState<Record<string, WeekData>>(courseWeekData);
  const [learningGoal, setLearningGoal] = useState<number>(5);
  const [weekProgress, setWeekProgress] = useState<WeekProgress>({
    m: false, t: false, w: false, th: false, f: false, s: false, su: false
  });

  // Calculate overall course progress
  const courseProgress = useMemo(() => {
    const totalLectures = Object.values(weekData).flatMap(week => 
      week.modules.flatMap(module => module.lectures)
    ).length;
    
    const completedLectures = Object.values(weekData).flatMap(week => 
      week.modules.flatMap(module => module.lectures.filter(lecture => lecture.completed))
    ).length;
    
    return Math.round((completedLectures / totalLectures) * 100);
  }, [weekData]);

  // Handle week selection
  const handleWeekSelect = (weekId: string) => {
    setSelectedWeek(weekId);
  };
  
  // Mark lecture as complete or incomplete
  const markLectureComplete = (weekId: string, moduleId: string, lectureId: string) => {
    setWeekData(prevData => {
      const updatedWeekData = { ...prevData };
      const moduleIndex = updatedWeekData[weekId].modules.findIndex(m => m.id === moduleId);
      if (moduleIndex === -1) return prevData;
      
      const lectureIndex = updatedWeekData[weekId].modules[moduleIndex].lectures.findIndex(l => l.id === lectureId);
      if (lectureIndex === -1) return prevData;
      
      // Toggle completion status
      const lecture = updatedWeekData[weekId].modules[moduleIndex].lectures[lectureIndex];
      const newCompletionStatus = !lecture.completed;
      lecture.completed = newCompletionStatus;
      
      // Update module progress counts
      const durationValue = parseInt(lecture.duration.split(' ')[0]) || 0;
      
      if (lecture.type === 'video') {
        updatedWeekData[weekId].modules[moduleIndex].videosLeft += newCompletionStatus ? -durationValue : durationValue;
      } else if (lecture.type === 'reading') {
        updatedWeekData[weekId].modules[moduleIndex].readingsLeft += newCompletionStatus ? -durationValue : durationValue;
      } else if (lecture.type === 'quiz') {
        updatedWeekData[weekId].modules[moduleIndex].assessmentsLeft += newCompletionStatus ? -1 : 1;
      }
      
      return updatedWeekData;
    });
  };

  // Update course progress in database when weekData changes
  useEffect(() => {
    if (courseId && token) {
      updateProgressMutation.mutate({ 
        courseId, 
        progress: courseProgress,
        token
      });
    }
  }, [courseProgress, courseId, token]);

  // Toggle module expansion
  const toggleModuleExpansion = (weekId: string, moduleId: string) => {
    setWeekData(prevData => {
      const updatedWeekData = { ...prevData };
      const moduleIndex = updatedWeekData[weekId].modules.findIndex(m => m.id === moduleId);
      if (moduleIndex === -1) return prevData;
      
      updatedWeekData[weekId].modules[moduleIndex].expanded = 
        !updatedWeekData[weekId].modules[moduleIndex].expanded;
      return updatedWeekData;
    });
  };
  
  // Toggle week completion status
  const toggleWeekComplete = (weekId: string) => {
    setWeekData(prevData => {
      const updatedWeekData = { ...prevData };
      updatedWeekData[weekId].completed = !updatedWeekData[weekId].completed;
      
      // Check if all weeks are completed
      const allWeeksCompleted = Object.values(updatedWeekData).every(week => week.completed);
      
      if (allWeeksCompleted && courseId && token) {
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
      
      return updatedWeekData;
    });
  };
  
  // Toggle day progress
  const toggleDayProgress = (day: keyof WeekProgress) => {
    setWeekProgress(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

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
                <span>{courseProgress}%</span>
              </div>
              <Progress value={courseProgress} className="h-2" />
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

          {/* Progress tracker for smaller screens (under 1400px) */}
          {!isLargeScreen && (
            <div className="mt-8">
              <CourseProgressTracker
                weekProgress={weekProgress}
                learningGoal={learningGoal}
                onDayToggle={toggleDayProgress}
                onGoalChange={setLearningGoal}
                courseDetails={courseDetails}
              />
            </div>
          )}
        </div>
        
        {/* Right sidebar with progress tracker - only shown on screens 1400px and larger */}
        {isLargeScreen && (
          <CourseProgressTracker
            weekProgress={weekProgress}
            learningGoal={learningGoal}
            onDayToggle={toggleDayProgress}
            onGoalChange={setLearningGoal}
            courseDetails={courseDetails}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CourseWeekView;