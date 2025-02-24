
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CustomMetricsGridProps {
  children: ReactNode;
  className?: string;
}

export const CustomMetricsGrid = ({ 
  children, 
  className 
}: CustomMetricsGridProps) => {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
      className
    )}>
      {children}
    </div>
  );
};
