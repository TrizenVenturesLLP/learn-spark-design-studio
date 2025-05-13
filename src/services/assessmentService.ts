
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';

export type AssessmentType = 'MCQ' | 'CODING';

export interface MCQQuestion {
  _id: string;
  type: 'MCQ';
  questionText: string;
  options: string[];
  correctAnswer: string;
  marks: number;
}

export interface CodingQuestion {
  _id: string;
  type: 'CODING';
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  testCases: {
    input: string;
    expectedOutput: string;
    isHidden?: boolean;
  }[];
  marks: number;
  sampleCode?: string;
}

export interface McqOption {
  text: string;
  isCorrect: boolean;
}

export interface McqQuestionData {
  _id?: string;
  questionText: string;
  options: McqOption[];
  explanation?: string;
}

export type Question = MCQQuestion | CodingQuestion;

export interface Assessment {
  _id: string;
  title: string;
  description: string;
  type: AssessmentType;
  questions: Question[] | McqQuestionData[];
  courseId: string;
  course?: { title: string };
  dayNumber: number;
  assignedDays: number[]; // Array of day numbers this assessment is assigned to
  dueDate: string;
  totalMarks: number;
  status: 'pending' | 'completed';
  isPublished: boolean;
  submissionDate?: string;
  score?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MCQSubmission {
  type: 'MCQ';
  questionId: string;
  selectedAnswer: string;
}

export interface CodingSubmission {
  type: 'CODING';
  questionId: string;
  code: string;
  language: string;
}

export interface AssessmentSubmission {
  assessmentId: string;
  answers: (MCQSubmission | CodingSubmission)[];
}

export interface AssessmentResult {
  assessmentId: string;
  studentId: string;
  score: number;
  totalMarks: number;
  submittedAt: string;
  answers: {
    questionId: string;
    isCorrect: boolean;
    studentAnswer: string;
    correctAnswer?: string;
  }[];
}

// Instructor Functions
export const useCreateAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assessmentData: any) => {
      const { data } = await axios.post('/api/assessments', assessmentData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor-assessments'] });
    },
  });
};

export const useUpdateAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, assessmentData }: { 
      id: string; 
      assessmentData: Partial<Assessment>;
    }) => {
      const { data } = await axios.put(`/api/assessments/${id}`, assessmentData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor-assessments'] });
      queryClient.invalidateQueries({ queryKey: ['assessment'] });
    },
  });
};

export const useDeleteAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/assessments/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor-assessments'] });
    },
  });
};

export const useInstructorAssessments = (courseId?: string) => {
  return useQuery({
    queryKey: ['instructor-assessments', courseId],
    queryFn: async () => {
      const endpoint = courseId 
        ? `/api/assessments/instructor?courseId=${courseId}`
        : '/api/assessments/instructor';
      const { data } = await axios.get(endpoint);
      return data as Assessment[];
    },
    enabled: true,
  });
};

// Student Functions
export const useStudentAssessments = (courseId?: string, day?: number) => {
  return useQuery({
    queryKey: ['student-assessments', courseId, day],
    queryFn: async () => {
      let endpoint = '/api/assessments/student';
      if (courseId) {
        endpoint += `?courseId=${courseId}`;
        if (day !== undefined) {
          endpoint += `&day=${day}`;
        }
      }
      const { data } = await axios.get(endpoint);
      return data as Assessment[];
    },
    enabled: !!courseId,
  });
};

export const useSubmitAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submission: AssessmentSubmission) => {
      const { data } = await axios.post(
        `/api/assessments/${submission.assessmentId}/submit`, 
        submission
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-assessments'] });
    },
  });
};

export const useAssessmentDetails = (assessmentId: string) => {
  return useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/assessments/${assessmentId}`);
      return data as Assessment;
    },
    enabled: !!assessmentId,
  });
};

export const useAssessmentResults = (assessmentId: string) => {
  return useQuery({
    queryKey: ['assessment-results', assessmentId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/assessments/${assessmentId}/results`);
      return data as AssessmentResult[];
    },
    enabled: !!assessmentId,
  });
};

export const useMyAssessmentResults = (courseId?: string) => {
  return useQuery({
    queryKey: ['my-assessment-results', courseId],
    queryFn: async () => {
      let endpoint = '/api/assessments/my-results';
      if (courseId) {
        endpoint += `?courseId=${courseId}`;
      }
      const { data } = await axios.get(endpoint);
      return data as AssessmentResult[];
    },
    enabled: !!courseId,
  });
};

// Test code submissions for coding assessments
export const useTestCodingSubmission = () => {
  return useMutation({
    mutationFn: async ({ 
      questionId, 
      code, 
      language 
    }: { 
      questionId: string; 
      code: string; 
      language: string;
    }) => {
      const { data } = await axios.post(`/api/assessments/test-code`, {
        questionId,
        code,
        language,
      });
      return data as {
        success: boolean;
        results: {
          testCase: number;
          passed: boolean;
          output?: string;
          error?: string;
        }[];
      };
    },
  });
};
