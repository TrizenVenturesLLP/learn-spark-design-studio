
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AssignmentSubmissions = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Assignment Submissions</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No submissions available.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentSubmissions;
