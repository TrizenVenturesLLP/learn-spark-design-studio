
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Use React.ComponentProps<typeof Loader2> to correctly type the props for Lucide icons
export const LoadingSpinner = ({ className, ...props }: React.ComponentProps<typeof Loader2>) => (
  <Loader2 className={cn("h-4 w-4 animate-spin", className)} {...props} />
);
