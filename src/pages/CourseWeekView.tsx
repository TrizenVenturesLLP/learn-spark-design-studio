
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, CheckCircle, AlertCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useUpdateProgress, Course, RoadmapDay } from '@/services/courseService';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MCQQuiz from '@/components/MCQQuiz';

// Import your logo image
import companyLogo from '/logo_footer.png'; // Adjust path as needed

interface CourseData extends Course {
  _id: string;
  title: string;
  description: string;
  roadmap: RoadmapDay[];
}

const VideoPlayer = ({ 
  videoUrl, 
  onVideoComplete,
  isEnabled = true 
}: { 
  videoUrl: string;
  onVideoComplete: () => void;
  isEnabled?: boolean;
}) => {
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [lastValidTime, setLastValidTime] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getDriveFileId = (url: string) => {
    try {
      const pattern = /(?:https?:\/\/)?(?:drive\.google\.com\/)?(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/;
      const match = url.match(pattern);
      return match ? match[1] : '';
    } catch (error) {
      console.error('Error parsing Google Drive URL:', error);
      return '';
    }
  };

  const fileId = getDriveFileId(videoUrl);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const checkVideoProgress = () => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({
            event: 'requesting',
            func: 'getCurrentTime'
          }),
          '*'
        );
      }
    };

    timer = setInterval(checkVideoProgress, 500);

    const handleMessage = (event: MessageEvent) => {
      if (event.origin === 'https://drive.google.com') {
        try {
          const data = JSON.parse(event.data);
          
          if (data.currentTime) {
            const newTime = parseFloat(data.currentTime);
            
            if (newTime > lastValidTime + 1 && newTime - lastValidTime < 10) {
              console.log('User tried to skip forward', newTime, lastValidTime);
              iframeRef.current?.contentWindow?.postMessage(
                JSON.stringify({
                  event: 'command',
                  func: 'seekTo',
                  args: [lastValidTime]
                }),
                '*'
              );
              setCurrentTime(lastValidTime);
            } else {
              setLastValidTime(newTime);
              setCurrentTime(newTime);
            }
          }

          if (data.percentPlayed >= 95 && !isVideoCompleted) {
            setIsVideoCompleted(true);
            onVideoComplete();
            clearInterval(timer);
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      clearInterval(timer);
      window.removeEventListener('message', handleMessage);
    };
  }, [onVideoComplete, isVideoCompleted, lastValidTime]);

  if (!fileId) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black flex items-center justify-center text-white">
        Invalid video URL
      </div>
    );
  }

  if (!isEnabled) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black/90 flex items-center justify-center text-white">
        <div className="text-center space-y-2">
          <AlertCircle className="h-8 w-8 mx-auto" />
          <p>Complete the previous day's content to unlock this video</p>
        </div>
      </div>
    );
  }

  const driveEmbedUrl = `https://drive.google.com/file/d/${fileId}/preview?controls=0&disablekb=1&modestbranding=1&rel=0&showinfo=0&enablejsapi=1&widgetid=1&fs=0&iv_load_policy=3&playsinline=1&autohide=1&html5=1&cc_load_policy=0`;

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black relative">
      <iframe
        ref={iframeRef}
        title="Course Video"
        width="100%"
        height="100%"
        src={driveEmbedUrl}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
      
      {/* Logo with overlay background - Updated with responsive classes */}
      <div className="absolute top-2 md:top-4 z-5 flex items-center" style={{ right: '-3px' }}>
        <div className="absolute inset-0 bg-black/0 rounded-lg -z-5" />
        <div className="px-2 py-1 md:px-3 md:py-2">
          <img 
            src={companyLogo}
            alt="Company Logo"
            className="h-5 w-auto md:h-7" // Smaller height on mobile, larger on desktop
          />
        </div>
      </div>
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
  const { courseId } = useParams<{ courseId: string }>();
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [watchedVideos, setWatchedVideos] = useState<number[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState<number[]>([]);
  const { token, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();
  const updateProgressMutation = useUpdateProgress();
  const navigate = useNavigate();

  const { data: course, isLoading, error } = useQuery<CourseData>({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!courseId) throw new Error("Course ID is required");
      const { data } = await axios.get(`/api/courses/${courseId}`);
      return data as CourseData;
    },
    enabled: !!courseId && isAuthenticated
  });

  useEffect(() => {
    if (!loading && !isAuthenticated && courseId) {
      localStorage.setItem('redirectPath', `/course/${courseId}/weeks`);
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate, courseId]);

  useEffect(() => {
    if (course && course.roadmap) {
      if (course.roadmap.length > 0 && selectedDay === 0) {
        setSelectedDay(course.roadmap[0].day);
      }
      
      if (typeof course.progress === 'number' && course.roadmap) {
        const completedCount = Math.round((course.progress * course.roadmap.length) / 100);
        const newCompletedDays = Array.from({ length: completedCount }, (_, i) => i + 1);
        setCompletedDays(newCompletedDays);
      }
    }
  }, [course, selectedDay]);

  const handleDayComplete = async (day: number) => {
    if (!token || !courseId || !course?.roadmap) return;
    
    let newCompletedDays: number[];
    
    if (completedDays.includes(day)) {
      newCompletedDays = completedDays.filter(d => d !== day);
    } else {
      newCompletedDays = [...completedDays, day];
    }
    
    setCompletedDays(newCompletedDays);
    
    const progressPercentage = Math.round((newCompletedDays.length / course.roadmap.length) * 100);
    
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
      
      setCompletedDays(completedDays);
    }
  };

  const handleVideoComplete = (day: number) => {
    console.log(`Video ${day} completed`);
    setWatchedVideos(prev => [...prev, day]);
    
    // Show quiz if available for this day
    const currentDay = course?.roadmap.find(d => d.day === day);
    if (currentDay?.mcqs && currentDay.mcqs.length > 0) {
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = (score: number) => {
    const currentDay = selectedDay;
    setQuizCompleted(prev => [...prev, currentDay]);
    setShowQuiz(false);
    
    toast({
      title: "Quiz completed",
      description: `You scored ${score}% on the quiz for Day ${currentDay}`,
    });
    
    // Mark day as complete after quiz
    if (!completedDays.includes(currentDay)) {
      handleDayComplete(currentDay);
    }
  };

  const isVideoEnabled = (day: number) => {
    if (day === 1) return true;
    return watchedVideos.includes(day - 1) || completedDays.includes(day - 1);
  };

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b">
        <h2 className="font-semibold">Course Content</h2>
        <p className="text-sm text-muted-foreground">{course?.title}</p>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)] md:h-[calc(100vh-10rem)]">
        <div className="p-4 space-y-2">
          {course?.roadmap.map((day) => (
            <button
              key={day.day}
              onClick={() => {
                setSelectedDay(day.day);
                setIsSidebarOpen(false);
                setShowQuiz(false); // Hide quiz when changing days
              }}
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
              {day.mcqs && day.mcqs.length > 0 && (
                <div className={cn(
                  "text-xs mt-1",
                  selectedDay === day.day 
                    ? "text-primary-foreground/80"
                    : "text-blue-500"
                )}>
                  Quiz: {day.mcqs.length} questions
                </div>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <Progress 
          value={(completedDays.length / (course?.roadmap.length || 1)) * 100} 
          className="h-2"
        />
        <p className="text-sm text-muted-foreground mt-2">
          {completedDays.length} of {course?.roadmap.length} days completed
        </p>
      </div>
    </>
  );

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
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-80 border-r bg-muted/40">
          <SidebarContent />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {currentDay && (
            <div className="max-w-4xl mx-auto space-y-6 pt-12 md:pt-0">
              <div>
                <h1 className="text-xl md:text-2xl font-bold mb-2">Day {currentDay.day}</h1>
                <p className="text-sm md:text-base text-muted-foreground">{currentDay.topics}</p>
              </div>

              {showQuiz && currentDay.mcqs && currentDay.mcqs.length > 0 ? (
                <MCQQuiz 
                  questions={currentDay.mcqs} 
                  onComplete={handleQuizComplete} 
                />
              ) : (
                <>
                  <Card>
                    <CardContent className="p-4 md:p-6">
                      <VideoPlayer 
                        videoUrl={currentDay.video} 
                        onVideoComplete={() => handleVideoComplete(currentDay.day)}
                        isEnabled={isVideoEnabled(currentDay.day)}
                      />
                    </CardContent>
                  </Card>

                  {currentDay.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg md:text-xl">Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm md:text-base text-muted-foreground whitespace-pre-wrap">
                          {currentDay.notes}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  <TranscriptSection transcript={currentDay.transcript} />

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg md:text-xl">Topics Covered</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {currentDay.topics}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Show quiz button if there are MCQs for this day */}
                  {currentDay.mcqs && currentDay.mcqs.length > 0 && watchedVideos.includes(currentDay.day) && !quizCompleted.includes(currentDay.day) && (
                    <Button
                      onClick={() => setShowQuiz(true)}
                      className="w-full mb-4"
                    >
                      Take Quiz ({currentDay.mcqs.length} questions)
                    </Button>
                  )}

                  <Button
                    onClick={() => handleDayComplete(currentDay.day)}
                    variant="default"
                    className={cn(
                      "w-full",
                      completedDays.includes(currentDay.day)
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    {completedDays.includes(currentDay.day)
                      ? "Mark as Incomplete"
                      : "Mark as Complete"}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseWeekView;
