import React from "react";

interface ButtonProps {
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function Button({
  type,
  disabled = false,
  className,
  isLoading = false,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`
        group relative w-full flex justify-center py-3 px-4 border border-transparent
        text-sm font-medium rounded-sm text-white
        bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
        transition duration-150 ease-in-out
        ${disabled ? "bg-red-300 cursor-not-allowed" : "shadow-md"}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
}
