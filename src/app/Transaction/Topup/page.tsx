import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectUserBalance, getBalance } from "../../../features/profileSlice";
import {
  topUp,
  selectTransactionStatus,
} from "../../../features/transactionSlice";
import type { Service } from "../../../features/transactionSlice";

import ProfileBalance from "../../../components/widgets/ProfileBalance";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import PaymentConfirmationModal from "../../../components/widgets/PaymentConfirmationModal";

const MIN_TOPUP = 10000;
const MAX_TOPUP = 1000000;

const TopUpSchema = Yup.object().shape({
  nominal: Yup.number()
    .typeError("Nominal harus berupa angka")
    .required("Nominal wajib diisi")
    .min(MIN_TOPUP, `Minimal Top Up Rp${MIN_TOPUP.toLocaleString("id-ID")}`)
    .max(MAX_TOPUP, `Maksimal Top Up Rp${MAX_TOPUP.toLocaleString("id-ID")}`),
});

const quickNominals = [10000, 20000, 50000, 100000, 250000, 500000];

export default function TopUp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const balance = useAppSelector(selectUserBalance);
  const topUpStatus = useAppSelector(selectTransactionStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<
    "confirm" | "success" | "failed"
  >("confirm");
  const [modalErrorMessage, setModalErrorMessage] = useState<
    string | undefined
  >(undefined);

  const isLoading = topUpStatus === "loading";

  const formik = useFormik({
    initialValues: {
      nominal: 10000,
    },
    validationSchema: TopUpSchema,
    onSubmit: () => {
      setModalStatus("confirm");
      setIsModalOpen(true);
    },
  });

  const handleQuickNominal = (amount: number) => {
    formik.setFieldValue("nominal", amount);
  };

  const confirmTopUp = async () => {
    const nominalAmount = formik.values.nominal;

    const resultAction = await dispatch(
      topUp({ top_up_amount: nominalAmount }),
    );

    if (topUp.fulfilled.match(resultAction)) {
      setModalStatus("success");
      formik.resetForm();
      dispatch(getBalance());
    } else if (topUp.rejected.match(resultAction)) {
      setModalErrorMessage(
        (resultAction.payload as string) || "Terjadi kesalahan saat top up.",
      );
      setModalStatus("failed");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalErrorMessage(undefined);
    if (modalStatus === "success") {
      navigate("/");
    }
  };

  const handleNominalInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("nominal", e.target.value);
  };

  useEffect(() => {
    if (balance === null) {
      dispatch(getBalance());
    }
  }, [dispatch, balance]);

  const isButtonDisabled = isLoading || !formik.isValid;

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
      <ProfileBalance />

      <div className="mt-8 w-full">
        <p className="text-md mt-4 sm:text-lg">Silahkan masukan</p>
        <p className="mt-2 text-xl font-bold sm:text-2xl">Nominal Top Up</p>

        <form onSubmit={formik.handleSubmit} className="mt-8 w-full space-y-6">
          <div className="flex w-full grid-cols-3 flex-col-reverse items-center gap-2 sm:gap-4 lg:grid">
            <div className="col-span-2 flex w-full flex-col gap-4">
              <Input
                id="nominal"
                name="nominal"
                type="text"
                placeholder="masukkan nominal Top Up"
                icon="Rp"
                value={formik.values.nominal}
                onChange={handleNominalInput}
                onBlur={formik.handleBlur}
                error={
                  formik.errors.nominal && formik.touched.nominal
                    ? formik.errors.nominal
                    : ""
                }
                disabled={isLoading}
              />

              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isButtonDisabled}
                className={`${isButtonDisabled ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"}`}
              >
                Top Up
              </Button>
            </div>
            <div className="col-span-1 grid w-full grid-cols-3 gap-2 sm:gap-4">
              {quickNominals.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={`rounded-sm border py-3 text-xs font-medium transition sm:text-sm ${
                    formik.values.nominal === amount
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-red-50"
                  } `}
                  onClick={() => handleQuickNominal(amount)}
                  disabled={isLoading}
                >
                  Rp{amount.toLocaleString("id-ID")}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      <PaymentConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={confirmTopUp}
        service={
          {
            service_code: "TOPUP",
            service_name: "Top Up Saldo",
            service_icon: "/assets/images/logo.png",
            service_tariff: formik.values.nominal,
            description: "Top up your balance.",
            transaction_type: "TOPUP",
          } as Service
        }
        amount={formik.values.nominal}
        status={modalStatus}
        errorMessage={modalErrorMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
