import { Check, Close } from "@mui/icons-material";
import type { Service } from "../../features/transactionSlice";

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  service?: Service;
  amount?: number;
  status: "confirm" | "success" | "failed";
  errorMessage?: string;
}

export default function PaymentConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  service,
  amount,
  status,
  errorMessage,
}: PaymentConfirmationModalProps) {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (status) {
      case "confirm":
        return (
          <>
            <div className="flex flex-col items-center justify-center">
              <img src="/Logo.png" alt="Logo" className="h-16 w-16" />
              <p className="mt-4 text-center text-lg">
                Beli {service?.service_name} senilai
              </p>
              <p className="mt-2 text-center text-3xl font-bold text-gray-800">
                Rp{amount?.toLocaleString("id-ID")} ?
              </p>
            </div>
            <div className="mt-4 flex flex-col">
              <button
                onClick={onConfirm}
                className="cursor-pointer px-6 py-3 text-lg font-medium text-red-500 transition hover:text-red-700"
              >
                Ya, lanjutkan Bayar
              </button>
              <button
                onClick={onClose}
                className="cursor-pointer px-6 py-3 text-lg font-medium text-gray-400"
              >
                Batalkan
              </button>
            </div>
          </>
        );
      case "success":
        return (
          <>
            <div className="flex flex-col items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500">
                <Check className="text-white" />
              </div>
              <p className="mt-4 text-center text-lg">
                Pembayaran {service?.service_name} sebesar
              </p>
              <p className="mt-2 text-center text-3xl font-bold text-green-500">
                Rp{amount?.toLocaleString("id-ID")}
              </p>
              <p className="mt-2 text-center text-lg">Berhasil!</p>
            </div>
            <button
              onClick={onClose}
              className="mt-4 cursor-pointer px-6 py-3 text-lg font-semibold text-red-500 transition hover:text-red-700"
            >
              Kembali ke Beranda
            </button>
          </>
        );
      case "failed":
        return (
          <>
            <div className="flex flex-col items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500">
                <Close className="text-white" />
              </div>
              <p className="mt-4 text-center text-lg">
                Pembayaran {service?.service_name} sebesar
              </p>
              <p className="text-center text-3xl font-bold text-red-500">
                Rp{amount?.toLocaleString("id-ID")}
              </p>
              <p className="mt-2 text-center text-lg">Gagal!</p>
              {errorMessage && (
                <p className="mt-2 text-center text-sm text-gray-600">
                  {errorMessage}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="mt-4 cursor-pointer px-6 py-3 text-lg font-semibold text-red-500 transition hover:text-red-700"
            >
              Kembali ke Beranda
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="flex w-full max-w-md flex-col items-center justify-center rounded-sm bg-white p-8 shadow-xl">
        {renderContent()}
      </div>
    </div>
  );
}
