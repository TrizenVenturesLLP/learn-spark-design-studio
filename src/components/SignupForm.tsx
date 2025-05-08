
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [signupError, setSignupError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }
    
    setSignupError('');
    setIsLoading(true);
    
    try {
      await signup(name, email, password);
      toast({
        title: "Account created",
        description: "Your account has been successfully created!",
        duration: 3000,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Signup error:", error);
      setSignupError('Failed to create account. Please try again.');
      toast({
        title: "Signup failed",
        description: "There was a problem creating your account. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-6 bg-card rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Create an Account</h2>
        <p className="text-muted-foreground mt-1">Join Trizen to access high-quality courses</p>
      </div>
      
      {signupError && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
          {signupError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passwordError && (
            <p className="text-sm text-destructive">{passwordError}</p>
          )}
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        <p>Already have an account? 
          <Button 
            variant="link" 
            className="pl-1" 
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
