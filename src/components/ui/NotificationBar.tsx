import { Close } from "@mui/icons-material";

interface NotificationBarProps {
  message: string;
  onClose: () => void;
  type?: "success" | "error" | "info";
}

export default function NotificationBar({
  message,
  onClose,
  type = "error",
}: NotificationBarProps) {
  const baseClasses =
    "flex items-center justify-between p-3 rounded-sm shadow-md mt-4";
  const typeClasses = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className={`ml-3 rounded-full p-1 transition ${
          type === "success"
            ? "hover:bg-green-200"
            : type === "error"
              ? "hover:bg-red-200"
              : "hover:bg-blue-200"
        }`}
        aria-label="Close"
      >
        <Close className="h-4 w-4" />
      </button>
    </div>
  );
}
