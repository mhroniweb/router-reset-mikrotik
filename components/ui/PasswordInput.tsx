import { forwardRef, useState, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * PasswordInput Component Props
 * 
 * Extends standard HTML input attributes with additional features
 * specific to password input fields
 */
export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Error message to display below the input */
  error?: string;
  /** Optional label text */
  label?: string;
  /** Optional helper text displayed below the input */
  helperText?: string;
  /** Custom icon to display on the left side */
  leftIcon?: React.ReactNode;
  /** Whether to show the toggle visibility button (default: true) */
  showToggle?: boolean;
}

/**
 * PasswordInput Component
 * 
 * A reusable password input component with the following features:
 * - Toggle password visibility (show/hide)
 * - Optional label and helper text
 * - Error state and message display
 * - Custom left icon support
 * - Fully accessible with proper ARIA attributes
 * - Consistent styling with the design system
 * 
 * @example
 * ```tsx
 * <PasswordInput
 *   label="Password"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   error={errors.password}
 *   helperText="Must be at least 6 characters"
 *   required
 * />
 * ```
 */
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      error,
      label,
      helperText,
      leftIcon,
      showToggle = true,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    // Generate a unique ID if not provided
    const inputId = id || `password-${Math.random().toString(36).substr(2, 9)}`;

    // Base input styles
    const baseStyles =
      "w-full px-4 py-2 border rounded-lg transition-all outline-none placeholder:text-gray-500 text-gray-900 focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed";

    // State-dependent styles
    const stateStyles = error
      ? "border-red-300 focus:ring-red-500"
      : "border-gray-300 focus:ring-indigo-500";

    // Padding adjustments for icons
    const paddingStyles = cn(
      leftIcon && "pl-10",
      showToggle && "pr-10"
    );

    /**
     * Toggle password visibility
     */
    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={cn(baseStyles, stateStyles, paddingStyles, className)}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            {...props}
          />

          {/* Toggle Visibility Button */}
          {showToggle && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={disabled}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                // Eye Off Icon (Password Hidden)
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                // Eye Icon (Password Visible)
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Helper Text */}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="mt-1 text-xs text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;

