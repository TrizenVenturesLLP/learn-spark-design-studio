
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStudentAssessments, Assessment, useSubmitAssessment, useMyAssessmentResults } from '@/services/assessmentService';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileCheck, Calendar, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const AssessmentCard = ({ assessment }: { assessment: Assessment }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const submitAssessment = useSubmitAssessment();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setSubmissionState('submitting');
      
      const answers = (assessment.questions as any[]).map(question => ({
        type: 'MCQ' as const,
        questionId: question._id,
        selectedAnswer: selectedAnswers[question._id] || '',
      }));

      const result = await submitAssessment.mutateAsync({
        assessmentId: assessment._id,
        answers,
      });

      setSubmissionState('submitted');
      setSubmissionResult(result);

      toast({
        title: 'Success',
        description: 'Assessment submitted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit assessment. Please try again.',
        variant: 'destructive',
      });
      setSubmissionState('idle');
    }
  };

  const isAllQuestionsAnswered = assessment.questions.every((q: any) => 
    !!selectedAnswers[q._id]
  );

  if (submissionState === 'submitted') {
    return (
      <Card className="mb-4">
        <CardHeader className="bg-muted/50">
          <div className="flex items-center justify-between">
            <CardTitle>{assessment.title}</CardTitle>
            <Badge variant={assessment.status === 'completed' ? 'secondary' : 'default'}>
              {assessment.status === 'completed' ? 'Completed' : 'Pending'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Due: {format(new Date(assessment.dueDate), 'PPP')}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center py-4">
              <p className="text-2xl font-bold">
                {submissionResult?.score || 0}/{assessment.questions.length}
              </p>
              <p className="text-muted-foreground">Your score</p>
            </div>
            
            <div className="space-y-6">
              {(assessment.questions as any[]).map((question, qIndex) => {
                const userAnswer = selectedAnswers[question._id];
                const correctOption = question.options.find((o: any) => o.isCorrect);
                const isCorrect = userAnswer === correctOption?.text;
                
                return (
                  <div key={question._id} className="border p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                        isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      )}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <p className="font-medium">{question.questionText}</p>
                    </div>
                    
                    <div className="ml-8 space-y-1">
                      <p>Your answer: <span className={isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{userAnswer}</span></p>
                      {!isCorrect && <p>Correct answer: <span className="text-green-600 font-medium">{correctOption?.text}</span></p>}
                      {question.explanation && (
                        <p className="text-sm text-muted-foreground mt-2">{question.explanation}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setSubmissionState('idle')}
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <CardTitle>{assessment.title}</CardTitle>
          <Badge variant={assessment.status === 'completed' ? 'secondary' : 'default'}>
            {assessment.status === 'completed' ? 'Completed' : 'Pending'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Due: {format(new Date(assessment.dueDate), 'PPP')}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <p className="text-muted-foreground">{assessment.description}</p>

          <div className="space-y-6">
            {(assessment.questions as any[]).map((question, index) => (
              <div key={question._id} className="space-y-3">
                <h3 className="font-medium">Question {index + 1}: {question.questionText}</h3>
                <RadioGroup
                  value={selectedAnswers[question._id]}
                  onValueChange={(value) => 
                    setSelectedAnswers(prev => ({ ...prev, [question._id]: value }))
                  }
                >
                  {question.options.map((option: any, optionIndex: number) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.text} 
                        id={`${question._id}-${optionIndex}`} 
                      />
                      <Label htmlFor={`${question._id}-${optionIndex}`}>{option.text}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={submissionState === 'submitting' || !isAllQuestionsAnswered}
          >
            {submissionState === 'submitting' ? 'Submitting...' : 'Submit Assessment'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CompletedAssessmentCard = ({ result }: { result: any }) => {
  return (
    <Card className="mb-4">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <CardTitle>{result.assessmentTitle}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Completed
            </Badge>
            <Badge variant="outline">
              Score: {result.score}/{result.totalMarks}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Submitted on: {format(new Date(result.submittedAt), 'PPP')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">{result.assessmentDescription}</p>
            <Button onClick={() => console.log('View details')}>
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Assessments = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { data: assessments, isLoading } = useStudentAssessments(courseId, selectedDay || undefined);
  const { data: results, isLoading: resultsLoading } = useMyAssessmentResults(courseId);

  if (isLoading || resultsLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  const dayAssessments = Array.from({ length: 30 }, (_, i) => {
    const dayNumber = i + 1;
    return {
      day: dayNumber,
      assessments: assessments?.filter(a => a.dayNumber === dayNumber) || [],
    };
  }).filter(day => day.assessments.length > 0);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/course/${courseId}/weeks`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Button>
        <h1 className="text-2xl font-bold ml-4">Course Assessments</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress 
                value={
                  assessments && assessments.length > 0
                    ? (results?.length || 0) / assessments.length * 100
                    : 0
                } 
                className="h-2"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {results?.length || 0} of {assessments?.length || 0} completed
              </p>
            </CardContent>
          </Card>

          {dayAssessments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  Days with Assessments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
                  <div className="p-4">
                    <Button 
                      onClick={() => setSelectedDay(null)}
                      variant={selectedDay === null ? "default" : "ghost"}
                      className="w-full justify-start mb-2"
                    >
                      All Days
                    </Button>
                    
                    {dayAssessments.map(({ day, assessments }) => (
                      <Button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        variant={selectedDay === day ? "default" : "ghost"}
                        className="w-full justify-start mb-2"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>Day {day}</span>
                          <Badge variant="outline">{assessments.length}</Badge>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <div className="space-y-4">
                {!selectedDay ? (
                  <>
                    <h2 className="text-xl font-semibold">All Pending Assessments</h2>
                    {assessments && assessments.length > 0 ? (
                      assessments
                        .filter(a => a.status !== 'completed')
                        .map(assessment => (
                          <AssessmentCard key={assessment._id} assessment={assessment} />
                        ))
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <p className="text-muted-foreground">No pending assessments</p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">Day {selectedDay} Assessments</h2>
                    {assessments?.filter(a => a.dayNumber === selectedDay && a.status !== 'completed').length ? (
                      assessments
                        .filter(a => a.dayNumber === selectedDay && a.status !== 'completed')
                        .map(assessment => (
                          <AssessmentCard key={assessment._id} assessment={assessment} />
                        ))
                    ) : (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <p className="text-muted-foreground">No pending assessments for Day {selectedDay}</p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Completed Assessments</h2>
                {results && results.length > 0 ? (
                  results.map(result => (
                    <CompletedAssessmentCard key={result.assessmentId} result={result} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">You haven't completed any assessments yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Assessments;
