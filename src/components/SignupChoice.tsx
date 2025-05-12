import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignupChoiceProps {
  selected: 'student' | 'instructor' | null;
  onSelect: (role: 'student' | 'instructor') => void;
}

const SignupChoice = ({ selected, onSelect }: SignupChoiceProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card
        className={cn(
          "cursor-pointer hover:border-primary/50 transition-colors",
          selected === 'student' && "border-primary bg-primary/5"
        )}
        onClick={() => onSelect('student')}
      >
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-full bg-primary/10 p-3">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Student</h3>
            <p className="text-sm text-muted-foreground">
              Join as a student to access courses and start learning
            </p>
          </div>
        </CardContent>
      </Card>

      <Card
        className={cn(
          "cursor-pointer hover:border-primary/50 transition-colors",
          selected === 'instructor' && "border-primary bg-primary/5"
        )}
        onClick={() => onSelect('instructor')}
      >
        <CardContent className="flex items-center gap-4 p-6">
          <div className="rounded-full bg-primary/10 p-3">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Instructor</h3>
            <p className="text-sm text-muted-foreground">
              Join as an instructor to create and publish courses
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupChoice;
