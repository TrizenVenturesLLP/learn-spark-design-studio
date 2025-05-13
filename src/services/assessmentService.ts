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

export type Question = MCQQuestion | CodingQuestion;

export interface Assessment {
  _id: string;
  title: string;
  description: string;
  type: AssessmentType;
  questions: Question[];
  courseId: string;
  assignedDays: number[]; // Array of day numbers this assessment is assigned to
  dueDate: string;
  totalMarks: number;
  status: 'pending' | 'completed';
  submissionDate?: string;
  score?: number;
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

// Instructor Functions
export const useCreateAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assessmentData: Omit<Assessment, '_id'>) => {
      const { data } = await axios.post('/api/assessments', assessmentData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
};

export const useUploadAssessmentPDF = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, courseId, assignedDays }: { 
      file: File; 
      courseId: string;
      assignedDays: number[];
    }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('courseId', courseId);
      formData.append('assignedDays', JSON.stringify(assignedDays));

      const { data } = await axios.post('/api/assessments/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
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
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
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
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
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
    enabled: !!courseId,
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
        if (day) {
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
      return data;
    },
    enabled: !!assessmentId,
  });
}; 