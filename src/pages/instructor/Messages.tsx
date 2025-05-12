
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InstructorMessages = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You have no new messages.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorMessages;
