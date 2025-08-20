import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "filled" | "outlined";
  inputSize?: "sm" | "default" | "lg";
  state?: "default" | "error" | "success";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = "default", inputSize = "default", state = "default", type, ...props }, ref) => {
    const baseClasses = "w-full transition-colors duration-200 focus:outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50";
    
    const variants = {
      default: "border border-gray-300 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
      filled: "border-0 bg-gray-100 focus:bg-gray-50 focus:ring-2 focus:ring-blue-500/20",
      outlined: "border-2 border-gray-300 bg-transparent focus:border-blue-500"
    };

    const sizes = {
      sm: "px-3 py-2 text-sm rounded-md",
      default: "px-4 py-3 text-base rounded-lg",
      lg: "px-5 py-4 text-lg rounded-xl"
    };

    const states = {
      default: "",
      error: "border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50",
      success: "border-green-500 focus:border-green-500 focus:ring-green-500/20 bg-green-50"
    };

    return (
      <input
        type={type}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[inputSize],
          state !== "default" ? states[state] : "",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
