import * as React from "react";
import { cn } from "@/lib/utils";

export interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
  helperText?: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ className, label, error, helperText, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    const isFloating = isFocused || hasValue;

    return (
      <div className="relative">
        <div
          className={cn(
            "group relative w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            error && "border-destructive focus-within:ring-destructive",
            className
          )}
        >
          <label
            className={cn(
              "absolute left-3 pointer-events-none transition-all duration-200",
              isFloating
                ? "transform -translate-y-4 scale-75 text-xs text-primary origin-[0] top-2 z-10 bg-background px-1"
                : "top-1/2 -translate-y-1/2 text-muted-foreground"
            )}
          >
            {label}
          </label>
          <input
            type={type}
            className={cn(
              "block w-full border-0 bg-transparent p-0 text-sm placeholder:text-transparent focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
              isFloating && "pt-4"
            )}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
        </div>
        {helperText && (
          <p
            className={cn(
              "text-xs mt-1 px-1",
              error ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };