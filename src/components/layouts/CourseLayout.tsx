
import React from 'react';
import { Card } from '@/components/ui/card';

interface CourseLayoutProps {
  children: React.ReactNode;
}

const CourseLayout: React.FC<CourseLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {children}
      </main>
    </div>
  );
};

export default CourseLayout;
