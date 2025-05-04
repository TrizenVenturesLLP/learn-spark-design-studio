
import React from 'react';
import EnrollForm from '@/components/EnrollForm';
import { useParams } from 'react-router-dom';

const CourseEnrollment = () => {
  const { courseId } = useParams();
  
  return (
    <div className="min-h-screen">
      <EnrollForm courseId={courseId} />
    </div>
  );
};

export default CourseEnrollment;
