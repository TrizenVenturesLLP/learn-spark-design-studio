
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NewCoursePage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Course creation form will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewCoursePage;
