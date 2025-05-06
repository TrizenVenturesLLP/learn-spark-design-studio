
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../lib/axios";

export interface Course {
  id: string;
  _id: string;
  image: string;
  title: string;
  description: string;
  longDescription: string;
  instructor: string;
  duration: string;
  rating: number;
  students: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  skills: string[];
  courses: {
    title: string;
    details: string;
  }[];
  testimonials: {
    text: string;
    author: string;
    since: string;
  }[];
  progress?: number; // Added for enrolled courses
  enrolledAt?: string; // Added for enrolled courses
  enrollmentStatus?: 'enrolled' | 'started' | 'completed'; // Added for enrollment status
  status?: 'enrolled' | 'started' | 'completed'; // Added for enrollment status
  lastAccessedAt?: string; // Added for tracking last access
}

// Fetch all courses
export const useAllCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async (): Promise<Course[]> => {
      const response = await axios.get(`/api/courses`);
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response format: expected an array of courses");
      }
      return response.data.map(course => course as Course);
    },
  });
};

// Get course by ID
export const useCourseDetails = (courseId: string | undefined) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async (): Promise<Course> => {
      if (!courseId) throw new Error("Course ID is required");
      
      const response = await axios.get(`/api/courses/${courseId}`);
      if (!response.data) {
        throw new Error(`Course with ID ${courseId} not found`);
      }
      return response.data as Course;
    },
    enabled: !!courseId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get enrolled courses for current user
export const useEnrolledCourses = (token: string | null) => {
  return useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: async (): Promise<Course[]> => {
      if (!token) throw new Error("Authentication required");
      const response = await axios.get(`/api/my-courses`);
      return response.data as Course[];
    },
    enabled: !!token,
  });
};

// Enroll in a course
export const useEnrollCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      courseId, 
      token 
    }: { 
      courseId: string, 
      token: string 
    }) => {
      const response = await axios.post(
        `/api/enrollments`, 
        { courseId }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// Update course progress and status
export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      courseId, 
      progress, 
      status,
      token 
    }: { 
      courseId: string, 
      progress: number,
      status?: 'enrolled' | 'started' | 'completed',
      token: string 
    }) => {
      const response = await axios.put(
        `/api/my-courses/${courseId}/progress`, 
        { progress, status }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch the relevant queries
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
    },
  });
};
