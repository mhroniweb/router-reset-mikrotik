import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "primary" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  isLoading?: boolean;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = "ghost",
      size = "md",
      icon,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
      ghost:
        "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-300",
      primary:
        "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 focus:ring-indigo-300",
      danger:
        "text-red-600 hover:text-red-700 hover:bg-red-50 focus:ring-red-300",
    };

    const sizes = {
      sm: "text-sm px-2 py-1 min-h-[28px]",
      md: "text-base px-3 py-1.5 min-h-[32px]",
      lg: "text-lg px-4 py-2 min-h-[40px]",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          icon
        )}
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
