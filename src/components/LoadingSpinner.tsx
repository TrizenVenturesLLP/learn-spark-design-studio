import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const LoadingSpinner = ({ className, ...props }: LoadingSpinnerProps) => (
  <Loader2 className={cn("h-4 w-4 animate-spin", className)} {...props} />
);