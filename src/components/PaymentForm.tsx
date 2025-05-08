
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  courseId: z.string(),
  courseName: z.string(),
  utrNumber: z.string().min(1, "UTR number is required"),
  transactionNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PaymentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const { toast } = useToast();
  const courseData = location.state?.course;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || '',
      courseId: courseData?._id || '',
      courseName: courseData?.title || '',
      utrNumber: '',
      transactionNotes: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please login to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post('/api/enrollment-requests', {
        ...values,
        userId: user?.id,
        status: 'pending',
        requestDate: new Date(),
      }, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });

      toast({
        title: "Enrollment request submitted",
        description: "Your request is pending admin approval",
      });

      navigate('/my-courses');
    } catch (error) {
      console.error("Enrollment request error:", error);
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (!courseData) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-2">Invalid course selection</h2>
        <p className="mb-4">Please select a course from the course list</p>
        <Button onClick={() => navigate('/explore-courses')}>
          Browse Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Course Enrollment Payment</CardTitle>
          <CardDescription>
            Please fill in the payment details for: <strong>{courseData.title}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Payment Instructions</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please make a payment using the QR code below and provide the transaction details.
            </p>
            
            <div className="flex flex-col items-center mb-4">
              <img 
                src="/lovable-uploads/payment-qr.png" 
                alt="Payment QR Code" 
                className="w-64 h-64 border p-2 mb-2" 
              />
              <p className="text-sm text-gray-500">Scan to pay</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="courseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="utrNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UTR Number / Transaction ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter transaction reference number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="transactionNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Add any additional information about your payment"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Payment Details</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentForm;
