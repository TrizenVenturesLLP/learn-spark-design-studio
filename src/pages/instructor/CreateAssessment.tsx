
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCourseDetails } from '@/services/courseService';
import { useCreateAssessment } from '@/services/assessmentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Check, Plus, Trash2, ArrowLeft } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Define form schema for assessment creation
const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  dayNumber: z.coerce.number().int().positive('Day number must be positive'),
  dueDate: z.date({
    required_error: 'Please select a due date',
  }),
  questions: z.array(
    z.object({
      questionText: z.string().min(5, 'Question must be at least 5 characters'),
      options: z.array(
        z.object({
          text: z.string().min(1, 'Option cannot be empty'),
          isCorrect: z.boolean().default(false),
        })
      ).min(2, 'At least 2 options are required').refine(
        options => options.some(option => option.isCorrect),
        {
          message: 'At least one option must be marked as correct',
        }
      ),
      explanation: z.string().optional(),
    })
  ).min(1, 'At least one question is required'),
});

type FormValues = z.infer<typeof formSchema>;

const CreateAssessment = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course } = useCourseDetails(courseId);
  const createAssessment = useCreateAssessment();
  const { toast } = useToast();
  
  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      dayNumber: 1,
      dueDate: new Date(),
      questions: [
        {
          questionText: '',
          explanation: '',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
        },
      ],
    },
  });

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!courseId) return;

    try {
      await createAssessment.mutateAsync({
        ...values,
        courseId,
        isPublished: false,
      });

      toast({
        title: "Assessment created",
        description: "The assessment has been created successfully.",
      });

      navigate(`/instructor/assessments`);
    } catch (error) {
      toast({
        title: "Error creating assessment",
        description: "Failed to create assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to add a new question
  const addQuestion = () => {
    const questions = form.getValues('questions') || [];
    form.setValue('questions', [
      ...questions,
      {
        questionText: '',
        explanation: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ]);
  };

  // Function to remove a question
  const removeQuestion = (index: number) => {
    const questions = form.getValues('questions');
    form.setValue(
      'questions',
      questions.filter((_, i) => i !== index)
    );
  };

  // Function to set an option as correct and clear others
  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    const questions = form.getValues('questions');
    const updatedOptions = questions[questionIndex].options.map((option, idx) => ({
      ...option,
      isCorrect: idx === optionIndex,
    }));

    form.setValue(`questions.${questionIndex}.options`, updatedOptions);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/instructor/assessments')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assessments
        </Button>
        <h1 className="text-2xl font-bold">Create Assessment</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter assessment title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dayNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day Number</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {course?.roadmap?.map((day) => (
                            <SelectItem key={day.day} value={day.day.toString()}>
                              Day {day.day}: {day.topics.substring(0, 30)}...
                            </SelectItem>
                          )) || (
                            <SelectItem value="1">Day 1</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter assessment description" 
                        className="h-24" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Questions</h3>
                  <Button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Question
                  </Button>
                </div>

                {form.watch('questions').map((question, questionIndex) => (
                  <Card key={questionIndex} className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Question {questionIndex + 1}</CardTitle>
                        {questionIndex > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuestion(questionIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <FormField
                        control={form.control}
                        name={`questions.${questionIndex}.questionText`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question Text</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your question"
                                className="h-20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2">
                        <FormLabel>Options (select the correct answer)</FormLabel>
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-3 my-2"
                          >
                            <Checkbox
                              checked={option.isCorrect}
                              onCheckedChange={() => 
                                setCorrectOption(questionIndex, optionIndex)
                              }
                              className="h-5 w-5"
                            />
                            <FormField
                              control={form.control}
                              name={`questions.${questionIndex}.options.${optionIndex}.text`}
                              render={({ field }) => (
                                <FormItem className="flex-1 m-0">
                                  <FormControl>
                                    <Input
                                      placeholder={`Option ${optionIndex + 1}`}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}
                        {form.formState.errors.questions?.[questionIndex]?.options?.message && (
                          <p className="text-sm font-medium text-destructive">
                            {form.formState.errors.questions[questionIndex].options.message}
                          </p>
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name={`questions.${questionIndex}.explanation`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Explanation (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Explain the correct answer"
                                className="h-20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/instructor/assessments')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createAssessment.isPending}
                  className="flex items-center gap-2"
                >
                  {createAssessment.isPending ? 'Creating...' : 'Create Assessment'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAssessment;
