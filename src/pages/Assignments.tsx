import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, CheckCircle, XCircle, ClipboardList } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: number;
  feedback?: string;
}

const assignments: Assignment[] = [
  {
    id: '1',
    title: 'Machine Learning Final Project',
    course: 'Machine Learning Fundamentals',
    dueDate: 'May 15, 2025',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Cloud Architecture Case Study',
    course: 'AWS Cloud Practitioner',
    dueDate: 'May 10, 2025',
    status: 'submitted'
  },
  {
    id: '3',
    title: 'React Native Mobile App',
    course: 'Mobile App Development',
    dueDate: 'May 5, 2025',
    status: 'graded',
    grade: 92,
    feedback: 'Excellent work! Great implementation of navigation.'
  },
  {
    id: '4',
    title: 'Database Design Project',
    course: 'Database Management',
    dueDate: 'May 1, 2025',
    status: 'overdue'
  }
];

const AssignmentCard = ({ assignment }: { assignment: Assignment }) => {
  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'submitted':
        return 'bg-blue-500';
      case 'graded':
        return 'bg-green-500';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:items-center mb-4">
          <div>
            <h3 className="font-semibold mb-1">{assignment.title}</h3>
            <p className="text-sm text-muted-foreground">{assignment.course}</p>
          </div>
          <Badge className={`${getStatusColor(assignment.status)} text-white whitespace-nowrap`}>
            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
          Due: {assignment.dueDate}
        </div>

        {assignment.grade && (
          <div className="mb-4">
            <div className="flex items-center">
              <span className="font-medium">Grade: </span>
              <span className="ml-2">{assignment.grade}%</span>
            </div>
            {assignment.feedback && (
              <p className="text-sm text-muted-foreground mt-1">
                {assignment.feedback}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
          {assignment.status === 'pending' && (
            <Button className="w-full">Submit</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Assignments = () => {
  const [activeTab] = useState('all');

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto bg-gray-50/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Assignments</h1>
              <p className="text-muted-foreground">
                View and manage your course assignments
              </p>
            </div>
          </div>

          <Tabs 
            defaultValue="all" 
            className="mb-6"
          >
            <div className="overflow-x-auto">
              <TabsList className="inline-flex min-w-max">
                <TabsTrigger value="all" className="px-4">All</TabsTrigger>
                <TabsTrigger value="pending" className="px-4">Pending</TabsTrigger>
                <TabsTrigger value="submitted" className="px-4">Submitted</TabsTrigger>
                <TabsTrigger value="graded" className="px-4">Graded</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-6">
              <Card className="w-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <ClipboardList className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Assignments Yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    You don't have any assignments at the moment. New assignments will appear here when your instructors create them.
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/contact-instructors'}>
                    <FileText className="w-4 h-4 mr-2" />
                    Contact Instructors
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Assignments;