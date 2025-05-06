import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface UserSettings {
  name: string;
  email: string;
  bio: string;
}

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ settings, token }: { settings: Partial<UserSettings>; token: string }) => {
      const { data } = await axios.patch('/api/user/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });
};

// Remove the JSON configuration from this file as it should be in a separate tsconfig.json file.