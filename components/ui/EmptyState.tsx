import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="flex justify-center mb-4 text-gray-400">{icon}</div>
      )}
      <p className="text-gray-500 text-lg font-medium">{title}</p>
      {description && (
        <p className="text-gray-400 text-sm mt-2">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

