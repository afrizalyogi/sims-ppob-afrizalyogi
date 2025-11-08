import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectUserBalance, getBalance } from "../../../features/profileSlice";
import {
  topUp,
  selectTransactionStatus,
  clearTransactionStatus,
} from "../../../features/transactionSlice";

import ProfileBalance from "../../../components/widgets/ProfileBalance";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

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

  const balance = useAppSelector(selectUserBalance);
  const topUpStatus = useAppSelector(selectTransactionStatus);

  const isLoading = topUpStatus === "loading";

  const formik = useFormik({
    initialValues: {
      nominal: 10000,
    },
    validationSchema: TopUpSchema,
    onSubmit: async (values) => {
      const resultAction = await dispatch(
        topUp({ top_up_amount: values.nominal }),
      );

      if (topUp.fulfilled.match(resultAction)) {
        alert("Top Up Berhasil! Saldo Anda akan segera diperbarui.");
        formik.resetForm();
        dispatch(getBalance());
        dispatch(clearTransactionStatus());
      } else if (topUp.rejected.match(resultAction)) {
        alert(`Top Up Gagal. ${resultAction.payload || "Silakan coba lagi."}`);
        dispatch(clearTransactionStatus());
      }
    },
  });

  const handleQuickNominal = (amount: number) => {
    formik.setFieldValue("nominal", amount);
  };

  const handleNominalInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("nominal", e.target.value);
  };

  useEffect(() => {
    if (balance === null) {
      dispatch(getBalance());
    }
  }, [dispatch, balance]);

  const isButtonDisabled =
    isLoading || !formik.isValid || formik.values.nominal === 0;

  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
      <ProfileBalance />

      <div className="mt-8 w-full">
        <p className="mt-4 text-lg">Silahkan masukan</p>
        <p className="mt-2 text-3xl font-bold">Nominal Top Up</p>

        <form onSubmit={formik.handleSubmit} className="mt-8 w-full space-y-6">
          <div className="flex w-full grid-cols-3 flex-col-reverse items-center gap-4 lg:grid">
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
            <div className="col-span-1 grid w-full grid-cols-3 gap-4">
              {quickNominals.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={`rounded-sm border py-3 text-sm font-medium transition ${
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
    </div>
  );
}
