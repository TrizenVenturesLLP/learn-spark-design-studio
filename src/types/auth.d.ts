
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
  // Add these properties for InstructorProfile.tsx
  profileCompletion?: number;
  stats?: {
    totalStudents?: number;
    totalCourses?: number;
    averageRating?: number;
    teachingHours?: number;
  };
  recentReviews?: Array<{
    student: string;
    rating: number;
    comment: string;
    date: string;
  }>;
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
