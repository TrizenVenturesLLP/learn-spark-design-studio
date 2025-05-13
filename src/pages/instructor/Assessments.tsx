
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInstructorAssessments, Assessment } from '@/services/assessmentService';
import { useToast } from '@/hooks/use-toast';

const InstructorAssessments = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: assessments, isLoading, error } = useInstructorAssessments(courseId);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateAssessment = () => {
    if (courseId) {
      navigate(`/instructor/courses/${courseId}/create-assessment`);
    } else {
      navigate('/instructor/create-assessment');
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading assessments...</div>;
  }

  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to load assessments',
      variant: 'destructive',
    });
    return <div className="p-6">Error loading assessments</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assessments</h1>
        <Button onClick={handleCreateAssessment}>
          <Plus className="h-4 w-4 mr-2" />
          Create Assessment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>All Assessments</CardTitle>
            <div className="flex space-x-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search assessments..."
                  className="pl-10 w-[250px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Assigned Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments && assessments.length > 0 ? (
                assessments.map((assessment) => (
                  <TableRow key={assessment._id}>
                    <TableCell>{assessment.title}</TableCell>
                    <TableCell>{assessment.type}</TableCell>
                    <TableCell>{new Date(assessment.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{assessment.assignedDays.join(', ')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(assessment.status)}`}>
                        {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No assessments found. Create your first assessment!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorAssessments;
