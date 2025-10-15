"use client";

import {
  HTMLAttributes,
  forwardRef,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "warning" | "info";
  title?: string;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  autoClose?: number; // Auto-close after X milliseconds
  showProgress?: boolean; // Show progress bar for auto-close
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "info",
      title,
      icon,
      dismissible = false,
      onDismiss,
      autoClose,
      showProgress = true,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const [progress, setProgress] = useState(100);

    // Auto-close timer
    useEffect(() => {
      if (!autoClose) return;

      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (autoClose / 50);
          if (newProgress <= 0) {
            handleDismiss();
            return 0;
          }
          return newProgress;
        });
      }, 50);

      return () => clearInterval(interval);
    }, [autoClose]);

    const handleDismiss = () => {
      setIsClosing(true);
      setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, 300); // Match animation duration
    };

    if (!isVisible) return null;

    const variants = {
      success: {
        container: "bg-green-50 border-green-200 text-green-800",
        icon: "text-green-600",
        button:
          "text-green-600 hover:bg-green-100 focus:ring-green-600 active:bg-green-200",
        progress: "bg-green-600",
      },
      error: {
        container: "bg-red-50 border-red-200 text-red-800",
        icon: "text-red-600",
        button:
          "text-red-600 hover:bg-red-100 focus:ring-red-600 active:bg-red-200",
        progress: "bg-red-600",
      },
      warning: {
        container: "bg-amber-50 border-amber-200 text-amber-800",
        icon: "text-amber-600",
        button:
          "text-amber-600 hover:bg-amber-100 focus:ring-amber-600 active:bg-amber-200",
        progress: "bg-amber-600",
      },
      info: {
        container: "bg-blue-50 border-blue-200 text-blue-800",
        icon: "text-blue-600",
        button:
          "text-blue-600 hover:bg-blue-100 focus:ring-blue-600 active:bg-blue-200",
        progress: "bg-blue-600",
      },
    };

    const defaultIcons = {
      success: (
        <svg
          className="h-5 w-5 sm:h-6 sm:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      error: (
        <svg
          className="h-5 w-5 sm:h-6 sm:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      warning: (
        <svg
          className="h-5 w-5 sm:h-6 sm:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      info: (
        <svg
          className="h-5 w-5 sm:h-6 sm:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    };

    const currentVariant = variants[variant];

    return (
      <div
        ref={ref}
        role="alert"
        aria-live="polite"
        className={cn(
          "relative overflow-hidden rounded-lg border shadow-sm transition-all duration-300 ease-in-out",
          currentVariant.container,
          isClosing
            ? "opacity-0 scale-95 translate-y-2"
            : "opacity-100 scale-100 translate-y-0",
          className
        )}
        {...props}
      >
        {/* Progress bar for auto-close */}
        {autoClose && showProgress && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-black bg-opacity-10">
            <div
              className={cn(
                "h-full transition-all duration-75 ease-linear",
                currentVariant.progress
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="p-3 sm:p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={cn("flex-shrink-0 mt-0.5", currentVariant.icon)}>
              {icon || defaultIcons[variant]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-sm sm:text-base font-semibold mb-1 leading-tight">
                  {title}
                </h3>
              )}
              <div className="text-sm sm:text-base leading-relaxed">
                {children}
              </div>
            </div>

            {/* Dismiss button */}
            {dismissible && (
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss alert"
                className={cn(
                  "flex-shrink-0 inline-flex rounded-lg p-1.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
                  currentVariant.button
                )}
              >
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";

export default Alert;
