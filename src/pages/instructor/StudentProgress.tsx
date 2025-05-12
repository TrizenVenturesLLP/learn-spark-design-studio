
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StudentProgress = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Student Progress</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Progress Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Student progress data will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProgress;
