import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Assessment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

// Fetch assessments for a student's course
export const useStudentAssessments = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['studentAssessments', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data } = await axios.get<Assessment[]>(`${API_URL}/api/courses/${courseId}/assessments`);
      return data;
    },
    enabled: !!courseId
  });
};

// Create a new assessment
export const useCreateAssessment = () => {
  return useMutation({
    mutationFn: async (assessment: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await axios.post<Assessment>(
        `${API_URL}/api/courses/${assessment.courseId}/assessments`, 
        assessment
      );
      return data;
    }
  });
};

// Update an assessment
export const useUpdateAssessment = () => {
  return useMutation({
    mutationFn: async ({ id, ...assessment }: Partial<Assessment> & { id: string }) => {
      const { data } = await axios.put<Assessment>(
        `${API_URL}/api/assessments/${id}`,
        assessment
      );
      return data;
    }
  });
};

// Delete an assessment
export const useDeleteAssessment = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`${API_URL}/api/assessments/${id}`);
      return id;
    }
  });
};
