
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';

interface InstructorApplication {
  _id: string;
  name: string;
  email: string;
  specialty: string;
  experience: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const InstructorApprovals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery<InstructorApplication[]>({
    queryKey: ['instructorApplications'],
    queryFn: async () => {
      const response = await axios.get<InstructorApplication[]>('/api/admin/instructor-applications');
      return response.data;
    },
  });

  const updateApplicationStatus = useMutation({
    mutationFn: async ({ 
      id, 
      status 
    }: { 
      id: string; 
      status: 'approved' | 'rejected' 
    }) => {
      await axios.put(`/api/admin/instructor-applications/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructorApplications'] });
      toast({
        title: 'Success',
        description: 'Application status updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update application status',
        variant: 'destructive',
      });
    },
  });

  const handleStatusUpdate = (id: string, status: 'approved' | 'rejected') => {
    updateApplicationStatus.mutate({ id, status });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-10">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Instructor Applications</CardTitle>
            <CardDescription>
              Review and manage instructor applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(applications ?? []).map((application) => (
                  <TableRow key={application._id}>
                    <TableCell className="font-medium">{application.name}</TableCell>
                    <TableCell>{application.email}</TableCell>
                    <TableCell>{application.specialty}</TableCell>
                    <TableCell>{application.experience} years</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          application.status === 'approved'
                            ? 'success'
                            : application.status === 'rejected'
                            ? 'destructive'
                            : 'default'
                        }
                      >
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(application.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {application.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              handleStatusUpdate(application._id, 'approved')
                            }
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleStatusUpdate(application._id, 'rejected')
                            }
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default InstructorApprovals;
