import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const checkbox = (
      <input
        ref={ref}
        type="checkbox"
        id={checkboxId}
        className={cn(
          "h-5 w-5 rounded border-gray-300 text-indigo-600 transition-all",
          "focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );

    if (label) {
      return (
        <label
          htmlFor={checkboxId}
          className="flex items-center space-x-3 cursor-pointer"
        >
          {checkbox}
          <span className="text-sm text-gray-700 select-none">{label}</span>
        </label>
      );
    }

    return checkbox;
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;

