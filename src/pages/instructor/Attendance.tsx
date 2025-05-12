
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StudentAttendance = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Student Attendance</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Attendance data will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendance;
