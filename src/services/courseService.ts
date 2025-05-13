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
  enrollmentStatus?: 'enrolled' | 'started' | 'completed' | 'pending'; // Added for enrollment status
  status?: 'enrolled' | 'started' | 'completed' | 'pending'; // Added for enrollment status
  lastAccessedAt?: string; // Added for tracking last access
  roadmap?: RoadmapDay[]; // Added for course weekly content
  price?: number; // Added for course pricing
  courseAccess?: boolean; // Added for course availability
  createdAt?: string; // Added for timestamp
}

// Define the RoadmapDay interface for course content structure
export interface RoadmapDay {
  day: number;
  topics: string;
  video: string;
  transcript?: string;
  notes?: string;
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
      status?: 'enrolled' | 'started' | 'completed' | 'pending',
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

// Submit enrollment request
export const useSubmitEnrollmentRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post(
        `/api/enrollment-requests`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
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

// Admin: Get all enrollment requests
export const useEnrollmentRequests = () => {
  return useQuery({
    queryKey: ['enrollment-requests'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/enrollment-requests');
      return response.data;
    },
  });
};

// Admin: Approve enrollment request
export const useApproveEnrollmentRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await axios.put(`/api/admin/enrollment-requests/${requestId}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollment-requests'] });
    },
  });
};

// Admin: Reject enrollment request
export const useRejectEnrollmentRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await axios.put(`/api/admin/enrollment-requests/${requestId}/reject`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollment-requests'] });
    },
  });
};

// Instructor: Get my courses
export const useInstructorCourses = () => {
  return useQuery({
    queryKey: ['instructor-courses'],
    queryFn: async (): Promise<Course[]> => {
      const response = await axios.get('/api/instructor/courses');
      return response.data as Course[];
    },
  });
};

// Instructor: Get students for a specific course
export interface CourseStudent {
  id: string;
  name: string;
  email: string;
  enrolledDate: string;
  progress: number;
  status: string;
  lastActive: string;
}

export interface CourseWithStudents {
  id: string;
  title: string;
  students: CourseStudent[];
}

export const useCourseStudents = (courseId: string | undefined) => {
  return useQuery<CourseWithStudents>({
    queryKey: ['course-students', courseId],
    queryFn: async (): Promise<CourseWithStudents> => {
      if (!courseId) throw new Error("Course ID is required");
      try {
        const response = await axios.get(`/api/instructor/courses/${courseId}/students`);
        // Ensure the response matches the expected type
        const data = response.data as CourseWithStudents;
        if (!data.id || !data.title || !Array.isArray(data.students)) {
          throw new Error("Invalid course data format received from server");
        }
        return data;
      } catch (error) {
        console.error('Error fetching course students:', error);
        throw error;
      }
    },
    enabled: !!courseId,
  });
};

// Instructor: Create new course
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (courseData: Partial<Course>) => {
      const response = await axios.post('/api/instructor/courses', courseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

// Instructor: Update course
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({courseId, courseData}: {courseId: string, courseData: Partial<Course>}) => {
      const response = await axios.put(`/api/instructor/courses/${courseId}`, courseData);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
    },
  });
};

// Instructor: Delete course
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (courseId: string) => {
      const response = await axios.delete(`/api/instructor/courses/${courseId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};
