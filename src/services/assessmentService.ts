
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';

// Types
export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

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
  testCases: TestCase[];
  marks: number;
  sampleCode?: string;
}

export type Question = MCQQuestion | CodingQuestion;
export type AssessmentType = 'MCQ' | 'CODING';

export interface Assessment {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  type: AssessmentType;
  questions: Question[];
  assignedDays: number[];
  dueDate: string;
  totalMarks: number;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}

// Interface for assessment submissions
export interface AssessmentSubmission {
  _id: string;
  studentId: string;
  studentName: string;
  assessmentId: string;
  submittedAt: string;
  score: number;
  answers: Array<{
    questionId: string;
    type: AssessmentType;
    selectedAnswer?: string;
    code?: string;
    language?: string;
    isCorrect?: boolean;
    score?: number;
  }>;
  feedback?: string;
  status: 'pending' | 'graded';
}

// Interface for assessment results overview
export interface AssessmentResults {
  submissions: AssessmentSubmission[];
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  submissionRate: number;
  completionRate: number;
}

// For instructor dashboard
export interface DashboardOverview {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  averageRating: number;
  totalReviews: number;
  teachingHours: number;
  profileCompletion: number;
  pendingAssessments?: Array<{
    title: string;
    dueDate: string;
    submissions: number;
    total: number;
  }>;
  completionRates: Array<{
    courseId: string;
    courseTitle: string;
    totalEnrollments: number;
    completions: number;
    completionRate: number;
  }>;
  recentActivity: Array<{
    type: 'enrollment' | 'review' | 'completion';
    date: string;
    studentName: string;
    studentId?: string;
    courseTitle: string;
    courseId?: string;
    rating?: number;
    comment?: string;
  }>;
  courseBreakdown: Array<{
    id: string;
    title: string;
    students: number;
    rating: number;
    created: string;
  }>;
}

// Hooks
export const useInstructorAssessments = (courseId: string) => {
  return useQuery({
    queryKey: ['assessments', courseId],
    queryFn: async () => {
      if (!courseId) {
        return [];
      }
      const { data } = await axios.get(`/api/instructor/courses/${courseId}/assessments`);
      return data as Assessment[];
    },
    enabled: !!courseId,
  });
};

export const useAssessmentDetails = (assessmentId: string) => {
  return useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/instructor/assessments/${assessmentId}`);
      return data as Assessment;
    },
    enabled: !!assessmentId,
  });
};

export const useAssessmentResults = <T = AssessmentResults>(assessmentId: string) => {
  return useQuery({
    queryKey: ['assessmentResults', assessmentId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/instructor/assessments/${assessmentId}/results`);
      return data as T;
    },
    enabled: !!assessmentId,
  });
};

export const useCreateAssessment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assessmentData: Partial<Assessment>) => {
      const { data } = await axios.post('/api/instructor/assessments', assessmentData);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assessments', variables.courseId] });
    },
  });
};

export const useUpdateAssessment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      id,
      assessmentData
    }: {
      id: string;
      assessmentData: Partial<Assessment>;
    }) => {
      const { data } = await axios.put(`/api/instructor/assessments/${id}`, assessmentData);
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      queryClient.invalidateQueries({ queryKey: ['assessment', variables.id] });
    },
  });
};

export const useDeleteAssessment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/instructor/assessments/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
};

export const useStudentAssessments = (courseId?: string, day?: number | null) => {
  return useQuery({
    queryKey: ['studentAssessments', courseId, day],
    queryFn: async () => {
      let url = '/api/student/assessments';
      
      if (courseId) {
        url = `/api/student/courses/${courseId}/assessments`;
      }
      
      if (day !== null && day !== undefined) {
        url += `?day=${day}`;
      }
      
      const { data } = await axios.get(url);
      return data as Assessment[];
    },
    enabled: !!courseId,
  });
};

export const useSubmitAssessment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      assessmentId,
      answers,
    }: {
      assessmentId: string;
      answers: Array<{
        type: AssessmentType;
        questionId: string;
        selectedAnswer?: string;
        code?: string;
        language?: string;
      }>;
    }) => {
      const { data } = await axios.post(`/api/student/assessments/${assessmentId}/submit`, {
        answers,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentAssessments'] });
    },
  });
};

// Add missing useUploadAssessmentPDF hook
export const useUploadAssessmentPDF = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      file,
      courseId,
      assignedDays,
    }: {
      file: File;
      courseId: string;
      assignedDays: number[];
    }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('courseId', courseId);
      formData.append('assignedDays', JSON.stringify(assignedDays));
      
      const { data } = await axios.post('/api/instructor/assessments/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assessments', variables.courseId] });
    },
  });
};
