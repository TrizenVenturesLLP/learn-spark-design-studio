
import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/axios';

interface EnrollmentRequest {
  _id: string;
  userId: string;
  courseId: string;
  courseName: string;
  email: string;
  utrNumber: string;
  transactionNotes?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  user?: {
    name: string;
    email: string;
  };
}

const EnrollmentRequests = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [enrollmentRequests, setEnrollmentRequests] = useState<EnrollmentRequest[]>([
    {
      _id: '1',
      userId: 'user123',
      courseId: 'course1',
      courseName: 'React Fundamentals',
      email: 'john@example.com',
      utrNumber: 'UTR123456789',
      transactionNotes: 'Payment made from ICICI Bank',
      status: 'pending',
      requestDate: new Date().toISOString(),
      user: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    },
    {
      _id: '2',
      userId: 'user456',
      courseId: 'course2',
      courseName: 'Advanced JavaScript',
      email: 'sarah@example.com',
      utrNumber: 'UTR987654321',
      status: 'pending',
      requestDate: new Date(Date.now() - 86400000).toISOString(),
      user: {
        name: 'Sarah Smith',
        email: 'sarah@example.com'
      }
    },
    {
      _id: '3',
      userId: 'user789',
      courseId: 'course3',
      courseName: 'Node.js Backend Development',
      email: 'mike@example.com',
      utrNumber: 'UTR567891234',
      status: 'approved',
      requestDate: new Date(Date.now() - 172800000).toISOString(),
      user: {
        name: 'Mike Johnson',
        email: 'mike@example.com'
      }
    },
    {
      _id: '4',
      userId: 'user321',
      courseId: 'course4',
      courseName: 'UI/UX Design Principles',
      email: 'lisa@example.com',
      utrNumber: 'UTR432156789',
      transactionNotes: 'Payment made from SBI Bank',
      status: 'rejected',
      requestDate: new Date(Date.now() - 259200000).toISOString(),
      user: {
        name: 'Lisa Brown',
        email: 'lisa@example.com'
      }
    }
  ]);
  
  const [selectedRequest, setSelectedRequest] = useState<EnrollmentRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (request: EnrollmentRequest) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const handleApprove = async (requestId: string) => {
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/enrollment-requests/${requestId}/approve`, {}, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // For now, just update the state
      setEnrollmentRequests(prev =>
        prev.map(req => 
          req._id === requestId 
            ? { ...req, status: 'approved' } 
            : req
        )
      );
      
      toast({
        title: "Request approved",
        description: "User has been granted access to the course",
      });
      
      setDetailsOpen(false);
    } catch (error) {
      console.error("Approval error:", error);
      toast({
        title: "Action failed",
        description: "Something went wrong, please try again",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      // In a real app, this would be an API call
      // await axios.put(`/api/enrollment-requests/${requestId}/reject`, {}, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      
      // For now, just update the state
      setEnrollmentRequests(prev =>
        prev.map(req => 
          req._id === requestId 
            ? { ...req, status: 'rejected' } 
            : req
        )
      );
      
      toast({
        title: "Request rejected",
        description: "Enrollment request has been rejected",
      });
      
      setDetailsOpen(false);
    } catch (error) {
      console.error("Rejection error:", error);
      toast({
        title: "Action failed",
        description: "Something went wrong, please try again",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingRequests = enrollmentRequests.filter(req => req.status === 'pending');
  const processedRequests = enrollmentRequests.filter(req => req.status === 'approved' || req.status === 'rejected');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Enrollment Requests</h2>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="pending">
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="processed">
              Processed ({processedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>UTR Number</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No pending enrollment requests
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingRequests.map((request) => (
                        <TableRow key={request._id}>
                          <TableCell>{formatDate(request.requestDate)}</TableCell>
                          <TableCell>{request.user?.name || request.email}</TableCell>
                          <TableCell>{request.courseName}</TableCell>
                          <TableCell>{request.utrNumber}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(request)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processed">
            <Card>
              <CardHeader>
                <CardTitle>Processed Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No processed enrollment requests
                        </TableCell>
                      </TableRow>
                    ) : (
                      processedRequests.map((request) => (
                        <TableRow key={request._id}>
                          <TableCell>{formatDate(request.requestDate)}</TableCell>
                          <TableCell>{request.user?.name || request.email}</TableCell>
                          <TableCell>{request.courseName}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(request)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Enrollment Request Details</DialogTitle>
              <DialogDescription>
                Review the payment and enrollment details
              </DialogDescription>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Student</p>
                    <p>{selectedRequest.user?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{selectedRequest.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Request Date</p>
                    <p>{formatDate(selectedRequest.requestDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Course</p>
                  <p>{selectedRequest.courseName}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">UTR Number</p>
                  <p>{selectedRequest.utrNumber}</p>
                </div>
                
                {selectedRequest.transactionNotes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Transaction Notes</p>
                    <p>{selectedRequest.transactionNotes}</p>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              {selectedRequest?.status === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => handleReject(selectedRequest._id)}
                  >
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleApprove(selectedRequest._id)}
                  >
                    Approve Enrollment
                  </Button>
                </>
              )}
              {selectedRequest?.status !== 'pending' && (
                <Button onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default EnrollmentRequests;
