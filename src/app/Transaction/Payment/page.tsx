import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectUserProfile,
  selectUserBalance,
  getBalance,
} from "../../../features/profileSlice";
import {
  selectServices,
  transaction,
  selectTransactionStatus,
  clearTransactionStatus,
  getServices,
} from "../../../features/transactionSlice";
import type { Service } from "../../../features/transactionSlice";

import ProfileBalance from "../../../components/widgets/ProfileBalance";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import PaymentConfirmationModal from "../../../components/widgets/PaymentConfirmationModal";

export default function Payment() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { serviceCode } = useParams<{ serviceCode: string }>();

  const user = useAppSelector(selectUserProfile);
  const balance = useAppSelector(selectUserBalance);
  const services = useAppSelector(selectServices);
  const transactionStatus = useAppSelector(selectTransactionStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<
    "confirm" | "success" | "failed"
  >("confirm");
  const [modalErrorMessage, setModalErrorMessage] = useState<
    string | undefined
  >(undefined);

  const userName = `${user?.first_name || "Pengguna"} ${user?.last_name || ""}`;
  const userImage =
    user?.profile_image ===
    "https://minio.nutech-integrasi.com/take-home-test/null"
      ? "/Profile Photo.png"
      : user?.profile_image || "/Profile Photo.png";

  const isLoading = transactionStatus === "loading";

  const selectedService = services.find((s) => s.service_code === serviceCode);

  useEffect(() => {
    dispatch(clearTransactionStatus());
  }, [dispatch]);

  useEffect(() => {
    if (services.length === 0) {
      dispatch(getServices());
    }
    if (balance === null) {
      dispatch(getBalance());
    }
  }, [dispatch, services.length, balance]);

  const handlePaymentClick = () => {
    if (!selectedService || !selectedService.service_tariff) {
      setModalErrorMessage("Detail layanan tidak valid.");
      setModalStatus("failed");
      setIsModalOpen(true);
      return;
    }

    const amount = selectedService.service_tariff;

    if (balance !== null && amount > balance) {
      setModalErrorMessage(
        "Saldo tidak mencukupi untuk melakukan transaksi ini.",
      );
      setModalStatus("failed");
      setIsModalOpen(true);
      return;
    }

    setModalStatus("confirm");
    setIsModalOpen(true);
  };

  const confirmPayment = async () => {
    if (!selectedService || !selectedService.service_tariff) {
      // This case should ideally not happen if checks are done before opening modal
      setModalErrorMessage("Detail layanan tidak valid.");
      setModalStatus("failed");
      return;
    }

    const amount = selectedService.service_tariff;

    const resultAction = await dispatch(
      transaction({
        service_code: selectedService.service_code,
        service_amount: amount,
      }),
    );

    if (transaction.fulfilled.match(resultAction)) {
      setModalStatus("success");
      dispatch(clearTransactionStatus());
      dispatch(getBalance()); // Refresh balance after successful transaction
    } else if (transaction.rejected.match(resultAction)) {
      setModalErrorMessage(
        (resultAction.payload as string) || "Terjadi kesalahan.",
      );
      setModalStatus("failed");
      dispatch(clearTransactionStatus());
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalErrorMessage(undefined);
    if (modalStatus === "success" || modalStatus === "failed") {
      navigate("/"); // Navigate to home after success or failure
    }
    dispatch(clearTransactionStatus()); // Clear transaction status on modal close
  };

  if (!selectedService) {
    if (services.length === 0 && transactionStatus === "loading") {
      return <div className="p-8 text-center">Memuat layanan...</div>;
    }
    return (
      <div className="p-8 text-center text-red-600">
        Layanan tidak ditemukan. Kembali ke beranda.
      </div>
    );
  }

  const serviceTariffFormatted = `Rp${selectedService.service_tariff.toLocaleString("id-ID")}`;

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
      <ProfileBalance
        userImage={userImage}
        userName={userName}
        balance={balance}
      />

      <div className="mt-8 rounded-sm bg-white p-6 shadow-md">
        <p>Pembayaran</p>
        <div className="mt-2 mb-8 flex items-center gap-2">
          {selectedService.service_icon && (
            <img
              src={selectedService.service_icon}
              alt={selectedService.service_name}
              className="h-8 w-8 object-contain"
            />
          )}
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedService.service_name}
          </h2>
        </div>

        <div className="space-y-6">
          <Input
            id="nominal"
            name="nominal"
            type="text"
            placeholder="Nominal"
            icon="Rp"
            value={serviceTariffFormatted}
            disabled={true}
          />

          <Button
            type="button"
            onClick={handlePaymentClick}
            isLoading={isLoading}
            disabled={isLoading}
            className="mt-6 w-full bg-red-500 hover:bg-red-600"
          >
            Bayar
          </Button>
        </div>
      </div>

      <PaymentConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={confirmPayment}
        service={selectedService as Service} // Cast to Service to ensure type compatibility
        amount={selectedService.service_tariff}
        status={modalStatus}
        errorMessage={modalErrorMessage}
      />
    </div>
  );
}
