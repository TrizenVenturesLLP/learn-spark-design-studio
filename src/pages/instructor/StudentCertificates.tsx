
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StudentCertificates = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Student Certificates</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Certificate data will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentCertificates;
