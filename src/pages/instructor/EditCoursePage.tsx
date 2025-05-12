
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EditCoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Editing course ID: {courseId}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCoursePage;
