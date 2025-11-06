import React from "react";

interface ButtonProps {
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
  variant?: "primary" | "outline";
}

export default function Button({
  type,
  onClick,
  disabled = false,
  className,
  isLoading = false,
  children,
  variant = "primary",
  ...rest
}: ButtonProps) {
  const baseStyles = `
    group relative w-full flex justify-center py-3 px-4 border
    text-sm font-medium rounded-sm
    transition duration-150 ease-in-out
  `;

  const variantStyles = {
    primary: `
      border-transparent text-white
      bg-red-500 hover:bg-red-700
      ${disabled ? "bg-red-300 cursor-not-allowed" : "shadow-md"}
    `,
    outline: `
      border-red-500 text-red-500
      bg-transparent hover:bg-red-50
      ${disabled ? "text-red-300 border-red-300 cursor-not-allowed" : "shadow-sm"}
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
}
