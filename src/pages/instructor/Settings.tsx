
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InstructorSettings = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Settings options will appear here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorSettings;
