import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';

export interface Discussion {
  _id: string;
  courseId: string;
  userId: {
    _id: string;
    name: string;
    displayName: string;
  };
  title: string;
  content: string;
  tags: string[];
  replies: Array<{
    _id: string;
    userId: {
      _id: string;
      name: string;
      displayName: string;
    };
    content: string;
    createdAt: string;
  }>;
  likes: string[];
  createdAt: string;
}

// Get discussions for a course
export const useCourseDiscussions = (courseId: string) => {
  return useQuery({
    queryKey: ['discussions', courseId],
    queryFn: async () => {
      const response = await axios.get<Discussion[]>(`/api/courses/${courseId}/discussions`);
      return response.data;
    },
    enabled: !!courseId,
  });
};

// Create new discussion
export const useCreateDiscussion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      courseId, 
      data 
    }: { 
      courseId: string; 
      data: { title: string; content: string; tags?: string[]; }; 
    }) => {
      const response = await axios.post(`/api/courses/${courseId}/discussions`, data);
      return response.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['discussions', courseId] });
    },
  });
};

// Add reply to discussion
export const useAddReply = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      discussionId, 
      content 
    }: { 
      discussionId: string; 
      content: string; 
    }) => {
      const response = await axios.post(`/api/discussions/${discussionId}/replies`, { content });
      return response.data;
    },
    onSuccess: (_, { discussionId }) => {
      // Get courseId from cache to invalidate discussions query
      const discussion = queryClient.getQueryData<Discussion>(['discussion', discussionId]);
      if (discussion) {
        queryClient.invalidateQueries({ queryKey: ['discussions', discussion.courseId] });
      }
    },
  });
};

// Toggle like on discussion
export const useToggleLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (discussionId: string) => {
      const response = await axios.post(`/api/discussions/${discussionId}/like`);
      return response.data;
    },
    onSuccess: (_, discussionId) => {
      // Get courseId from cache to invalidate discussions query
      const discussion = queryClient.getQueryData<Discussion>(['discussion', discussionId]);
      if (discussion) {
        queryClient.invalidateQueries({ queryKey: ['discussions', discussion.courseId] });
      }
    },
  });
};

// Delete discussion
export const useDeleteDiscussion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ discussionId, courseId }: { discussionId: string; courseId: string }) => {
      const response = await axios.delete(`/api/discussions/${discussionId}`);
      return response.data;
    },
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['discussions', courseId] });
    },
  });
};