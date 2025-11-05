interface InputProps {
  id?: string;
  name?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string | null | undefined;
  disabled?: boolean;
  className?: string;
}

export default function Input({
  id,
  name,
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
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
            {icon}
          </span>
        )}

        <input
          id={id}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            block w-full px-3 py-3 border rounded-sm
            placeholder-gray-500 text-gray-900
            focus:outline-none focus:ring-2 focus:border-transparent
            ${borderStyle}
            ${icon ? "pl-10" : "pl-3"}
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
            ${className}
          `}
          {...rest}
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
