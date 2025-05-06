import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

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
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold mb-1">{assignment.title}</h3>
            <p className="text-sm text-muted-foreground">{assignment.course}</p>
          </div>
          <Badge className={`${getStatusColor(assignment.status)} text-white`}>
            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Clock className="h-4 w-4 mr-2" />
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

        <div className="flex gap-2">
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
  const [activeTab, setActiveTab] = useState('all');

  const filteredAssignments = assignments.filter(assignment => {
    if (activeTab === 'all') return true;
    return assignment.status === activeTab;
  });

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Assignments</h1>
            <p className="text-muted-foreground">
              View and manage your course assignments
            </p>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Submission
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="graded">Graded</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAssignments.map(assignment => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Assignments;