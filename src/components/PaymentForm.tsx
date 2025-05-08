
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseDetails } from "@/services/courseService";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import axios from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

// Define form schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  utrNumber: z.string().min(1, { message: "UTR number is required" }),
  transactionScreenshot: z.instanceof(FileList).refine(
    (files) => files.length === 1,
    "Please upload a transaction screenshot"
  ),
});

type FormValues = z.infer<typeof formSchema>;

const PaymentForm = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { data: course, isLoading: courseLoading } = useCourseDetails(courseId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
      utrNumber: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!courseId || !course) return;

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("utrNumber", data.utrNumber);
      formData.append("courseName", course.title);
      formData.append("courseId", courseId);
      formData.append("transactionScreenshot", data.transactionScreenshot[0]);
      
      await axios.post("/api/enrollment-requests", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      toast({
        title: "Enrollment request submitted",
        description: "We will review your payment details and activate your course access soon.",
      });
      
      navigate("/my-courses");
    } catch (error) {
      console.error("Error submitting enrollment request:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your enrollment request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (courseLoading) {
    return <LoadingSpinner />;
  }

  if (!course) {
    return <div className="text-center py-10">Course not found</div>;
  }

  return (
    <div className="container max-w-lg py-10">
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Complete your enrollment for <span className="font-semibold">{course.title}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 border p-4 rounded-md bg-slate-50">
            <h3 className="text-sm font-medium mb-2">Scan QR code to make payment</h3>
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/payment-qr.png" 
                alt="Payment QR Code" 
                className="max-w-[200px] mb-2" 
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              After payment, fill the form below with your payment details
            </p>
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
                      <Input {...field} disabled={!!user?.email} />
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
                    <FormLabel>UTR Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter transaction UTR number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="transactionScreenshot"
                render={({ field: { onChange, value, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Transaction Screenshot</FormLabel>
                    <FormControl>
                      <Input 
                        {...fieldProps}
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          onChange(e.target.files);
                          handleImageChange(e);
                        }} 
                      />
                    </FormControl>
                    {imagePreview && (
                      <div className="mt-2 border rounded-md overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Transaction Screenshot Preview" 
                          className="max-h-40 mx-auto" 
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Course: {course.title}
                </p>
                {course.level && (
                  <p className="text-sm text-muted-foreground">
                    Level: {course.level}
                  </p>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button 
            type="submit" 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Payment Details"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentForm;
