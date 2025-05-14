
import { useQuery, useMutation, UseMutationResult } from '@tanstack/react-query';
import axios from '../lib/axios';
import { Assessment } from '@/types/assessment';

// Fetch course assessments
export const useAssessments = (courseId: string | undefined, token: string | null) => {
  return useQuery({
    queryKey: ['assessments', courseId],
    queryFn: async () => {
      if (!courseId || !token) return [] as Assessment[];
      
      try {
        const response = await axios.get(`/api/assessments/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data as Assessment[];
      } catch (error) {
        console.error('Error fetching assessments:', error);
        return [] as Assessment[];
      }
    },
    enabled: !!courseId && !!token
  });
};

// Fetch assessment by id
export const useAssessment = (assessmentId: string | undefined, token: string | null) => {
  return useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: async () => {
      if (!assessmentId || !token) return null;
      
      try {
        const response = await axios.get(`/api/assessment/${assessmentId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching assessment:', error);
        return null;
      }
    },
    enabled: !!assessmentId && !!token
  });
};

// Create new assessment
export const useCreateAssessment = (token: string | null): UseMutationResult<Assessment, Error, Omit<Assessment, '_id' | 'createdAt' | 'updatedAt'>, unknown> => {
  return useMutation({
    mutationFn: async (assessment: Omit<Assessment, '_id' | 'createdAt' | 'updatedAt'>) => {
      if (!token) throw new Error('Authentication required');
      
      const response = await axios.post('/api/assessments', assessment, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    }
  });
};

// Update assessment
export const useUpdateAssessment = (token: string | null): UseMutationResult<Assessment, Error, { id: string, assessment: Partial<Assessment> }, unknown> => {
  return useMutation({
    mutationFn: async ({ id, assessment }) => {
      if (!token) throw new Error('Authentication required');
      
      const response = await axios.put(`/api/assessments/${id}`, assessment, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    }
  });
};

// Delete assessment
export const useDeleteAssessment = (token: string | null): UseMutationResult<void, Error, string, unknown> => {
  return useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Authentication required');
      
      await axios.delete(`/api/assessments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  });
};

// Fetch instructor's assessments
export const useInstructorAssessments = (token: string | null) => {
  return useQuery({
    queryKey: ['instructor-assessments'],
    queryFn: async () => {
      if (!token) return [] as Assessment[];
      
      try {
        const response = await axios.get('/api/instructor/assessments', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data as Assessment[];
      } catch (error) {
        console.error('Error fetching instructor assessments:', error);
        return [] as Assessment[];
      }
    },
    enabled: !!token
  });
};

// Fetch student's upcoming assessments
export const useStudentAssessments = (token: string | null) => {
  return useQuery({
    queryKey: ['student-assessments'],
    queryFn: async () => {
      if (!token) return [] as Assessment[];
      
      try {
        const response = await axios.get('/api/student/assessments', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data as Assessment[];
      } catch (error) {
        console.error('Error fetching student assessments:', error);
        return [] as Assessment[];
      }
    },
    enabled: !!token
  });
};
