import { useEffect } from "react";
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

import ProfileBalance from "../../../components/widgets/ProfileBalance";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function Payment() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { serviceCode } = useParams<{ serviceCode: string }>();

  const user = useAppSelector(selectUserProfile);
  const balance = useAppSelector(selectUserBalance);
  const services = useAppSelector(selectServices);
  const transactionStatus = useAppSelector(selectTransactionStatus);

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

  const handlePayment = async () => {
    if (!selectedService || !selectedService.service_tariff) {
      alert("Detail layanan tidak valid.");
      return;
    }

    const amount = selectedService.service_tariff;

    if (balance !== null && amount > balance) {
      alert("Saldo tidak mencukupi untuk melakukan transaksi ini.");
      return;
    }

    if (
      window.confirm(
        `Anda yakin ingin membayar ${selectedService.service_name} sebesar Rp${amount.toLocaleString("id-ID")}?`,
      )
    ) {
      const resultAction = await dispatch(
        transaction({
          service_code: selectedService.service_code,
          service_amount: amount,
        }),
      );

      if (transaction.fulfilled.match(resultAction)) {
        alert("Pembayaran Berhasil! Saldo Anda akan diperbarui.");
        dispatch(clearTransactionStatus());
        dispatch(getBalance());
        navigate("/transaction/history");
      } else if (transaction.rejected.match(resultAction)) {
        alert(`Pembayaran Gagal. ${resultAction.payload || "Coba lagi."}`);
        dispatch(clearTransactionStatus());
      }
    }
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

      <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Pembayaran {selectedService.service_name}
        </h2>

        <div className="space-y-6">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            {selectedService.service_icon && (
              <img
                src={selectedService.service_icon}
                alt={selectedService.service_name}
                className="h-8 w-8 object-contain"
              />
            )}
            <span>{selectedService.service_name}</span>
            <span className="ml-2 text-red-500">(Tarif Prabayar)</span>
          </div>

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
            onClick={handlePayment}
            isLoading={isLoading}
            disabled={isLoading}
            className="mt-6 w-full bg-red-500 hover:bg-red-600"
          >
            Bayar
          </Button>
        </div>
      </div>
    </div>
  );
}
