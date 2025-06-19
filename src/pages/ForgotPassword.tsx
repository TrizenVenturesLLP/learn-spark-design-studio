import React, { useState, useRef, KeyboardEvent, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, Lock, Eye, EyeOff, KeyRound, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

// Configure axios to use the correct base URL
axios.defaults.baseURL = 'http://localhost:5001';

// Form schemas
const emailSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const otpSchema = z.object({
  otp: z.string().length(6, "Verification code must be 6 digits"),
});

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetState = 'email' | 'otp' | 'password';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
}

const OTPInput = forwardRef<HTMLDivElement, OTPInputProps>(({ value, onChange }, ref) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  if (inputRefs.current.length === 0) {
    inputRefs.current = new Array(6).fill(null);
  }

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Combine and send up
    const combinedOtp = newOtp.join("");
    onChange(combinedOtp);

    // Move to next input if value is entered
    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split("").forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      onChange(newOtp.join(""));
      // Focus last filled input or first empty one
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <div ref={ref} className="flex gap-2 justify-center items-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          ref={el => {
            if (el) {
              inputRefs.current[index] = el;
            }
          }}
          value={digit}
          onChange={e => handleChange(e.target, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-14 text-2xl font-bold text-center border-2 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none bg-white"
          style={{ aspectRatio: '1' }}
        />
      ))}
    </div>
  );
});

OTPInput.displayName = 'OTPInput';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetState, setResetState] = useState<ResetState>('email');
  const [email, setEmail] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmitEmail = async (values: z.infer<typeof emailSchema>) => {
    try {
      setIsLoading(true);
      setError("");
      setEmail(values.email);
      
      const response = await axios.post<{ success: boolean; message: string }>('/api/auth/send-verification', {
        email: values.email
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message || "Verification code sent successfully. Please check your email.",
        });
        setResetState('otp');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to send verification code. Please try again.";
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOTP = async (values: z.infer<typeof otpSchema>) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await axios.post<{ success: boolean; message: string }>('/api/auth/verify-otp', {
        email,
        otp: values.otp
      });

      if (response.data.success) {
        setIsOtpVerified(true);
        toast({
          title: "Success",
          description: "Verification successful. Please set your new password.",
        });
        setResetState('password');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Invalid verification code. Please try again.";
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPassword = async (values: z.infer<typeof passwordSchema>) => {
    if (!isOtpVerified) {
      setError("Please verify your email with OTP first.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please verify your email with OTP first.",
      });
      setResetState('otp');
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await axios.post<{ success: boolean; message: string }>('/api/auth/reset-password', {
        email,
        password: values.password
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Your password has been successfully reset.",
        });
        navigate('/login');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to reset password. Please try again.";
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to go back to previous step
  const goBack = () => {
    if (resetState === 'otp') {
      setResetState('email');
    } else if (resetState === 'password') {
      setResetState('otp');
    } else {
      navigate('/login');
    }
  };

  const getStepIcon = (step: ResetState) => {
    switch (step) {
      case 'email':
        return <Mail className="h-8 w-8 text-primary" />;
      case 'otp':
        return <KeyRound className="h-8 w-8 text-primary" />;
      case 'password':
        return <Lock className="h-8 w-8 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4"
              >
                {getStepIcon(resetState)}
              </motion.div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reset Password</h1>
              <div className="flex justify-center gap-2 mt-4">
                <div className={cn("w-3 h-3 rounded-full", resetState === 'email' ? "bg-primary" : "bg-gray-200")} />
                <div className={cn("w-3 h-3 rounded-full", resetState === 'otp' ? "bg-primary" : "bg-gray-200")} />
                <div className={cn("w-3 h-3 rounded-full", resetState === 'password' ? "bg-primary" : "bg-gray-200")} />
              </div>
              <p className="mt-4 text-gray-600">
                {resetState === 'email' && "Enter your email address and we'll send you a verification code."}
                {resetState === 'otp' && "Enter the verification code sent to your email."}
                {resetState === 'password' && "Create a new password for your account."}
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={goBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              {resetState === 'email' ? 'Back to login' : 'Back'}
            </Button>

            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <AnimatePresence mode="wait">
              {resetState === 'email' && (
                <motion.div
                  key="email"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                >
                  <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
                      <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary overflow-hidden bg-white">
                                <div className="px-3 py-2 border-r bg-gray-50">
                                  <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="Enter your email address"
                                  className="border-0 focus-visible:ring-0 text-lg"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full py-6 text-lg relative overflow-hidden transition-all duration-300"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2 justify-center">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span>Sending code...</span>
                          </div>
                        ) : (
                          "Send Verification Code"
                        )}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}

              {resetState === 'otp' && (
                <motion.div
                  key="otp"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                >
                  <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(onSubmitOTP)} className="space-y-4">
                      <FormField
                        control={otpForm.control}
                        name="otp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-center block mb-4">Enter Verification Code</FormLabel>
                            <FormControl asChild>
                              <OTPInput 
                                value={field.value} 
                                onChange={(value) => field.onChange(value)} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full py-6 text-lg mt-6"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2 justify-center">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span>Verifying...</span>
                          </div>
                        ) : (
                          "Verify your Code"
                        )}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}

              {resetState === 'password' && isOtpVerified && (
                <motion.div
                  key="password"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                >
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary overflow-hidden bg-white">
                                <div className="px-3 py-2 border-r bg-gray-50">
                                  <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter new password"
                                  className="border-0 focus-visible:ring-0 text-lg"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="px-3"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                  ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary overflow-hidden bg-white">
                                <div className="px-3 py-2 border-r bg-gray-50">
                                  <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                  {...field}
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirm new password"
                                  className="border-0 focus-visible:ring-0 text-lg"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="px-3"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                  ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full py-6 text-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2 justify-center">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            <span>Updating password...</span>
                          </div>
                        ) : (
                          "Reset Password"
                        )}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword; 