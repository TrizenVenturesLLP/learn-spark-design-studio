
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  FileQuestion,
  BookOpen,
  Calendar
} from 'lucide-react';
import { 
  useInstructorAssessments,
  useDeleteAssessment,
  Assessment
} from '@/services/assessmentService';
import { useInstructorCourses, Course } from '@/services/courseService';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AssessmentsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch instructor courses
  const { data: courses = [], isLoading: isLoadingCourses } = useInstructorCourses();
  
  // Fetch assessments for the selected course
  const { 
    data: assessments = [], 
    isLoading: isLoadingAssessments,
    refetch: refetchAssessments 
  } = useInstructorAssessments(selectedCourseId);
  
  // Delete assessment mutation
  const deleteAssessment = useDeleteAssessment();

  const handleDeleteAssessment = async (id: string) => {
    try {
      await deleteAssessment.mutateAsync(id);
      toast({
        title: 'Assessment deleted',
        description: 'The assessment has been successfully deleted.',
      });
      refetchAssessments();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete the assessment.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateAssessment = () => {
    if (selectedCourseId) {
      navigate(`/instructor/courses/${selectedCourseId}/create-assessment`);
    } else {
      toast({
        title: 'Please select a course',
        description: 'You need to select a course before creating an assessment.',
        variant: 'destructive',
      });
    }
  };

  // Filter assessments based on search query
  const filteredAssessments = assessments.filter(assessment => 
    assessment.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate status based on due date
  const getAssessmentStatus = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    if (due < now) return 'closed';
    return 'active';
  };

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle>All Assessments</CardTitle>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
              <Select
                value={selectedCourseId}
                onValueChange={setSelectedCourseId}
              >
                <SelectTrigger className="w-full md:w-[240px]">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course: Course) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search assessments..."
                  className="pl-10 w-full md:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingCourses || isLoadingAssessments ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : selectedCourseId ? (
            filteredAssessments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssessments.map((assessment: Assessment) => {
                    const status = getAssessmentStatus(assessment.dueDate);
                    return (
                      <TableRow key={assessment._id}>
                        <TableCell className="font-medium">{assessment.title}</TableCell>
                        <TableCell>{assessment.type}</TableCell>
                        <TableCell>{new Date(assessment.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{assessment.questions?.length || 0}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/instructor/assessments/${assessment._id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/instructor/assessments/${assessment._id}/edit`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                                    <span className="text-red-600">Delete</span>
                                  </DropdownMenuItem>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Confirm Deletion</DialogTitle>
                                  </DialogHeader>
                                  <p>Are you sure you want to delete this assessment? This action cannot be undone.</p>
                                  <div className="flex justify-end space-x-2 mt-4">
                                    <Button variant="outline" onClick={() => {}}>Cancel</Button>
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleDeleteAssessment(assessment._id)}
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <FileQuestion className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No assessments found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'No assessments match your search criteria.' : 'This course does not have any assessments yet.'}
                </p>
                <Button onClick={handleCreateAssessment}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assessment
                </Button>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a course</h3>
              <p className="text-muted-foreground mb-4">Please select a course to view its assessments.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentsList;
