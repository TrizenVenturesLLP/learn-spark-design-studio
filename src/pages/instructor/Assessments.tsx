
import React, { useState } from 'react';
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
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInstructorAssessments, useDeleteAssessment, useUpdateAssessment } from '@/services/assessmentService';
import { useInstructorCourses } from '@/services/courseService';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const InstructorAssessments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [assessmentToDelete, setAssessmentToDelete] = useState<string | null>(null);
  const { data: courses } = useInstructorCourses();
  const { data: assessments, isLoading } = useInstructorAssessments(selectedCourseId || undefined);
  const deleteAssessment = useDeleteAssessment();
  const updateAssessment = useUpdateAssessment();
  const { toast } = useToast();

  const filteredAssessments = assessments?.filter(assessment => 
    assessment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (isPublished: boolean) => {
    return isPublished 
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  };

  const handleCreateAssessment = () => {
    if (!selectedCourseId) {
      toast({
        title: "Course selection required",
        description: "Please select a course before creating an assessment.",
        variant: "destructive",
      });
      return;
    }
    navigate(`/instructor/create-assessment/${selectedCourseId}`);
  };

  const handleDeleteAssessment = async () => {
    if (!assessmentToDelete) return;
    
    try {
      await deleteAssessment.mutateAsync(assessmentToDelete);
      toast({
        title: "Assessment deleted",
        description: "The assessment has been successfully deleted.",
      });
      setAssessmentToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assessment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublish = async (id: string, isCurrentlyPublished: boolean) => {
    try {
      await updateAssessment.mutateAsync({ 
        id, 
        assessmentData: { isPublished: !isCurrentlyPublished } 
      });
      
      toast({
        title: isCurrentlyPublished ? "Assessment unpublished" : "Assessment published",
        description: isCurrentlyPublished 
          ? "The assessment is now hidden from students." 
          : "The assessment is now visible to students.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update assessment status. Please try again.",
        variant: "destructive",
      });
    }
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
          <div className="flex justify-between items-center">
            <CardTitle>All Assessments</CardTitle>
            <div className="flex space-x-2 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[250px]"
                />
              </div>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Courses</SelectItem>
                  {courses?.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading assessments...
                  </TableCell>
                </TableRow>
              ) : filteredAssessments?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No assessments found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAssessments?.map((assessment) => (
                  <TableRow key={assessment._id}>
                    <TableCell className="font-medium">{assessment.title}</TableCell>
                    <TableCell>{assessment.course?.title || 'Unknown Course'}</TableCell>
                    <TableCell>Day {assessment.dayNumber}</TableCell>
                    <TableCell>{format(new Date(assessment.dueDate), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{assessment.questions?.length || 0}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(assessment.isPublished)}`}>
                        {assessment.isPublished ? 'Published' : 'Draft'}
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
                          <DropdownMenuItem onClick={() => navigate(`/instructor/assessments/${assessment._id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/instructor/edit-assessment/${assessment._id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTogglePublish(assessment._id, assessment.isPublished)}>
                            <FileCheck className="h-4 w-4 mr-2" />
                            {assessment.isPublished ? 'Unpublish' : 'Publish'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setAssessmentToDelete(assessment._id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!assessmentToDelete} onOpenChange={(open) => !open && setAssessmentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this assessment and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAssessment} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InstructorAssessments;
