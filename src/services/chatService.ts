import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';

interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    role: 'instructor' | 'student';
  };
  timestamp: Date;
}

// Fetch messages for a specific instructor
export const useInstructorMessages = (instructorId: string) => {
  return useQuery({
    queryKey: ['instructorMessages', instructorId],
    queryFn: async () => {
      const response = await axios.get(`/api/messages/instructor/${instructorId}`);
      return response.data as Message[];
    },
    enabled: !!instructorId,
  });
};

// Send a new message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      instructorId, 
      content 
    }: { 
      instructorId: string; 
      content: string; 
    }) => {
      const response = await axios.post(`/api/messages/instructor/${instructorId}`, {
        content,
      });
      return response.data;
    },
    onSuccess: (_, { instructorId }) => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({
        queryKey: ['instructorMessages', instructorId],
      });
    },
  });
};

// Mark messages as read
export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (instructorId: string) => {
      const response = await axios.post(`/api/messages/instructor/${instructorId}/read`);
      return response.data;
    },
    onSuccess: (_, instructorId) => {
      queryClient.invalidateQueries({
        queryKey: ['instructorMessages', instructorId],
      });
    },
  });
}; 