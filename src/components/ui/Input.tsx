import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string | null | undefined;
}

export default function Input({
  id,
  name,
  type,
  value,
  placeholder,
  icon,
  error,
  disabled = false,
  className,
  ...rest
}: InputProps) {
  const borderStyle = error
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-red-500";

  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <span className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-sm text-gray-300">
            {icon}
          </span>
        )}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          className={`block w-full rounded-sm border p-3 text-sm text-gray-900 placeholder-gray-300 focus:border-transparent focus:ring-2 focus:outline-none ${borderStyle} ${icon ? "pl-12" : "pl-3"} ${disabled ? "cursor-not-allowed bg-gray-50" : "bg-white"} ${className} `}
          {...rest}
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
