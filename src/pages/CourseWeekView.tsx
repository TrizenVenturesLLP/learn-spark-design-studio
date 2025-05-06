
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useUpdateProgress } from '@/services/courseService';

interface RoadmapDay {
  day: number;
  topics: string;
  video: string;
  transcript?: string;
}

interface CourseData {
  _id: string;
  title: string;
  description: string;
  roadmap: RoadmapDay[];
}

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  // Extract video ID from YouTube URL
  const getYouTubeId = (url: string) => {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : url;
  };

  const videoId = getYouTubeId(videoUrl);

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
};

const TranscriptSection = ({ transcript }: { transcript?: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!transcript) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Video Transcript</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "prose prose-sm max-w-none text-muted-foreground",
            !isExpanded && "max-h-32 overflow-hidden"
          )}
        >
          {transcript}
        </div>
      </CardContent>
    </Card>
  );
};

const CourseWeekView = () => {
  const { courseId } = useParams();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const { token } = useAuth();
  const { toast } = useToast();
  const updateProgressMutation = useUpdateProgress();

  const { data: course, isLoading, error } = useQuery<CourseData>({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/courses/${courseId}`);
      return data;
    }
  });

  // Load completed days from the course data when it's fetched
  useEffect(() => {
    if (course) {
      // Initialize selected day
      if (course.roadmap?.length > 0) {
        setSelectedDay(course.roadmap[0].day);
      }
      
      // Initialize completed days from the course progress data
      if (typeof course.progress === 'number' && course.roadmap) {
        const completedCount = Math.round((course.progress * course.roadmap.length) / 100);
        const newCompletedDays = Array.from({ length: completedCount }, (_, i) => i + 1);
        setCompletedDays(newCompletedDays);
      }
    }
  }, [course]);

  const handleDayComplete = async (day: number) => {
    if (!token || !courseId || !course?.roadmap) return;
    
    let newCompletedDays: number[];
    
    if (completedDays.includes(day)) {
      // Remove day from completed days
      newCompletedDays = completedDays.filter(d => d !== day);
    } else {
      // Add day to completed days
      newCompletedDays = [...completedDays, day];
    }
    
    setCompletedDays(newCompletedDays);
    
    // Calculate progress percentage
    const progressPercentage = Math.round((newCompletedDays.length / course.roadmap.length) * 100);
    
    // Determine course status
    let status = 'enrolled';
    if (progressPercentage > 0 && progressPercentage < 100) {
      status = 'started';
    } else if (progressPercentage === 100) {
      status = 'completed';
    }
    
    try {
      await updateProgressMutation.mutateAsync({
        courseId,
        progress: progressPercentage,
        status: status as 'enrolled' | 'started' | 'completed',
        token
      });
      
      toast({
        title: completedDays.includes(day) ? "Progress removed" : "Progress saved",
        description: completedDays.includes(day) 
          ? `Day ${day} marked as incomplete` 
          : `Day ${day} marked as complete`,
      });
    } catch (error) {
      toast({
        title: "Error saving progress",
        description: "Could not update your course progress. Please try again.",
        variant: "destructive",
      });
      
      // Revert the UI state if the API call fails
      setCompletedDays(completedDays);
    }
  };

  if (isLoading || error || !course) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          {isLoading ? (
            <div className="animate-spin"><Video className="h-6 w-6" /></div>
          ) : (
            <div className="flex items-center text-red-500">
              <AlertCircle className="h-6 w-6 mr-2" />
              <span>Error loading course content</span>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  const currentDay = course.roadmap.find(day => day.day === selectedDay);

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 border-r bg-muted/40">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Course Content</h2>
            <p className="text-sm text-muted-foreground">{course.title}</p>
          </div>
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="p-4 space-y-2">
              {course.roadmap.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={cn(
                    "flex flex-col w-full p-3 rounded-lg text-sm gap-1 transition-colors text-left",
                    selectedDay === day.day
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                    completedDays.includes(day.day) && selectedDay !== day.day && "text-green-500"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Day {day.day}</span>
                      {completedDays.includes(day.day) && (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-xs opacity-70">
                      {completedDays.includes(day.day) ? 'Completed' : 'Not Started'}
                    </span>
                  </div>
                  <p className={cn(
                    "text-xs mt-1 line-clamp-2",
                    selectedDay === day.day 
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  )}>
                    {day.topics}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <Progress 
              value={(completedDays.length / course.roadmap.length) * 100} 
              className="h-2"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {completedDays.length} of {course.roadmap.length} days completed
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentDay && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">Day {currentDay.day}</h1>
                <p className="text-muted-foreground">{currentDay.topics}</p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <VideoPlayer videoUrl={currentDay.video} />
                </CardContent>
              </Card>

              <TranscriptSection transcript={currentDay.transcript} />

              <Card>
                <CardHeader>
                  <CardTitle>Topics Covered</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {currentDay.topics}
                  </p>
                </CardContent>
              </Card>

              <Button
                onClick={() => handleDayComplete(currentDay.day)}
                className={cn(
                  "w-full p-2 rounded-lg",
                  completedDays.includes(currentDay.day)
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {completedDays.includes(currentDay.day)
                  ? "Mark as Incomplete"
                  : "Mark as Complete"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseWeekView;
