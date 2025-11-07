import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectUserProfile,
  selectUserBalance,
  getBalance,
} from "../../../features/profileSlice";
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

  const user = useAppSelector(selectUserProfile);
  const balance = useAppSelector(selectUserBalance);
  const topUpStatus = useAppSelector(selectTransactionStatus);

  const userName = `${user?.first_name || "Pengguna"} ${user?.last_name || ""}`;
  const userImage =
    user?.profile_image ===
    "https://minio.nutech-integrasi.com/take-home-test/null"
      ? "/Profile Photo.png"
      : user?.profile_image || "/Profile Photo.png";

  const isLoading = topUpStatus === "loading";

  const formik = useFormik({
    initialValues: {
      nominal: 0,
      nominalString: "",
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
    formik.setFieldValue("nominalString", amount);
    formik.setFieldTouched("nominal", true);
  };

  const handleNominalInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = parseInt(rawValue) || 0;

    formik.setFieldValue("nominal", numericValue);
    formik.setFieldValue("nominalString", rawValue);
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
      <ProfileBalance
        userImage={userImage}
        userName={userName}
        balance={balance}
      />

      <div className="mt-8 w-full">
        <p className="mt-4 text-lg">Silahkan masukan</p>
        <p className="mt-2 text-3xl font-bold">Nominal Top Up</p>

        <form onSubmit={formik.handleSubmit} className="mt-8 w-full space-y-6">
          <div className="flex w-full grid-cols-3 flex-col-reverse items-center gap-4 lg:grid">
            <div className="col-span-2 flex w-full flex-col gap-4">
              <Input
                id="nominalString"
                name="nominalString"
                type="text"
                placeholder="masukkan nominal Top Up"
                icon="Rp"
                value={formik.values.nominalString}
                onChange={handleNominalInput}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.nominal && formik.errors.nominal
                    ? formik.errors.nominal
                    : undefined
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
