
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { MCQQuestion } from "./courseService";

export type Assessment = {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  type: 'MCQ' | 'CODING';
  dueDate: string;
  status: 'pending' | 'completed';
  assignedDays: number[];
  questions: (MCQQuestion | CodingQuestion)[];
  score?: number;
};

export type CodingQuestion = {
  _id: string;
  type: 'CODING';
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  sampleCode?: string;
};

export const useStudentAssessments = (courseId?: string, day?: number | null) => {
  return useQuery({
    queryKey: ['student-assessments', courseId, day],
    queryFn: async (): Promise<Assessment[]> => {
      const url = day 
        ? `/api/courses/${courseId}/assessments?day=${day}` 
        : `/api/courses/${courseId}/assessments`;
      const response = await axios.get(url);
      return response.data;
    },
    enabled: !!courseId,
  });
};

type MCQAnswer = {
  type: 'MCQ';
  questionId: string;
  selectedAnswer: string;
};

type CodingAnswer = {
  type: 'CODING';
  questionId: string;
  code: string;
  language: string;
};

type Answer = MCQAnswer | CodingAnswer;

export const useSubmitAssessment = () => {
  return useMutation({
    mutationFn: async ({ 
      assessmentId, 
      answers 
    }: { 
      assessmentId: string; 
      answers: Answer[];
    }) => {
      const response = await axios.post(
        `/api/assessments/${assessmentId}/submit`,
        { answers }
      );
      return response.data;
    }
  });
};

export const useCreateAssessment = () => {
  return useMutation({
    mutationFn: async (assessmentData: {
      courseId: string;
      title: string;
      description: string;
      type: 'MCQ' | 'CODING';
      dueDate: string;
      assignedDays: number[];
      questions: (MCQQuestion | CodingQuestion)[];
    }) => {
      const response = await axios.post('/api/instructor/assessments', assessmentData);
      return response.data;
    }
  });
};

export const useInstructorAssessments = (courseId?: string) => {
  return useQuery({
    queryKey: ['instructor-assessments', courseId],
    queryFn: async (): Promise<Assessment[]> => {
      const response = await axios.get(`/api/instructor/courses/${courseId}/assessments`);
      return response.data;
    },
    enabled: !!courseId,
  });
};
