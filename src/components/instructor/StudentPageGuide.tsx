import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users,
  BookOpen,
  HelpCircle,
  X,
  Info
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const StudentPageGuide = () => {
  const [showGuide, setShowGuide] = useState(true);

  if (!showGuide) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setShowGuide(true)} className="mb-4">
        <HelpCircle className="h-4 w-4 mr-2" />
        Show Guide
      </Button>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center">
          <Info className="h-4 w-4 text-blue-500 mr-2" />
          Student Management Guide
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setShowGuide(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>New:</strong> Use the course selector to easily switch between different courses.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <BookOpen className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Course Selection</p>
                <p className="text-muted-foreground">
                  Use the dropdown menu at the top to quickly switch between your courses without navigating back.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Users className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Student Filtering</p>
                <p className="text-muted-foreground">
                  Use the search bar to find students by name or email. Filter by status (Active, Completed, Inactive) using the dropdown menu.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="font-medium">Progress Tracking</p>
                <p className="text-muted-foreground">
                  The progress bar shows how far each student has advanced through your course material.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              <div>
                <p className="font-medium">Direct Communication</p>
                <p className="text-muted-foreground">
                  Use the Actions menu to directly contact students via email or messaging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentPageGuide; 