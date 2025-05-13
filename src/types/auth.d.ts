
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'instructor' | 'student' | 'admin';
  avatar?: string;
  bio?: string;
  title?: string;
  phone?: string;
  expertise?: string;
  createdAt: string;
  updatedAt: string;
  displayName?: string;
  instructorProfile?: {
    phone?: string;
    location?: string;
    specialty?: string;
    experience?: number;
    bio?: string;
    avatar?: string;
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      website?: string;
    };
  };
  status?: 'pending' | 'approved' | 'rejected';
}

// Helper function to safely access user properties
export function safelyAccessUser<T>(obj: any, accessor: (user: User) => T, defaultValue: T): T {
  try {
    if (!obj) return defaultValue;
    return accessor(obj as User) || defaultValue;
  } catch (error) {
    return defaultValue;
  }
}
