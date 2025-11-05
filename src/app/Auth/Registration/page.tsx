import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  registration,
  selectAuthStatus,
  selectAuthError,
  clearAuthStatus,
} from "../../../features/authSlice";

import Input from "../../../components/UI/Input";
import Button from "../../../components/UI/Button";

const allowedTlds = [
  "com",
  "net",
  "org",
  "info",
  "biz",
  "co",
  "id",
  "mil",
  "edu",
  "gov",
  "io",
  "app",
  "xyz",
  "online",
  "store",
];

const tldPattern = `(${allowedTlds.join("|").replace(/\./g, "\\.")})`;

const strictEmailRegex = new RegExp(
  `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.${tldPattern}$`,
);

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format Email tidak valid")
    .matches(
      strictEmailRegex,
      `Ekstensi email tidak valid. Contoh format: nama@domain.com`,
    )
    .required("Email wajib diisi"),
  first_name: Yup.string().required("Nama depan wajib diisi"),
  last_name: Yup.string().required("Nama belakang wajib diisi"),
  password: Yup.string()
    .min(8, "Password minimal 8 karakter")
    .required("Password wajib diisi"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Konfirmasi password tidak cocok")
    .required("Konfirmasi password wajib diisi"),
});

export default function Register() {
  const dispatch = useAppDispatch();

  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const isLoading = status === "loading";

  const formik = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      const apiData = {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
      };
      dispatch(registration(apiData));
    },
  });

  useEffect(() => {
    if (status === "succeeded" && !registrationSuccess) {
      alert("Registrasi Berhasil! Anda akan diarahkan ke halaman Login.");
      setRegistrationSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } else if (status === "failed" && error) {
      alert(`Registrasi Gagal: ${error}`);
      dispatch(clearAuthStatus());
    }
  }, [status, error, dispatch, registrationSuccess]);

  return (
    <div className="flex min-h-screen">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-500">SIMS PPOB</h2>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
              Lengkapi data untuk membuat akun
            </h1>
          </div>

          <form className="mt-8 space-y-4" onSubmit={formik.handleSubmit}>
            <Input
              id="email"
              type="email"
              placeholder="Masukkan email anda"
              icon="📧"
              {...formik.getFieldProps("email")}
              error={formik.touched.email ? formik.errors.email : undefined}
              disabled={isLoading}
            />
            <Input
              id="first_name"
              type="text"
              placeholder="Nama depan"
              icon="👤"
              {...formik.getFieldProps("first_name")}
              error={
                formik.touched.first_name ? formik.errors.first_name : undefined
              }
              disabled={isLoading}
            />
            <Input
              id="last_name"
              type="text"
              placeholder="Nama belakang"
              icon="👤"
              {...formik.getFieldProps("last_name")}
              error={
                formik.touched.last_name ? formik.errors.last_name : undefined
              }
              disabled={isLoading}
            />
            <Input
              id="password"
              type="password"
              placeholder="Buat password"
              icon="🔒"
              {...formik.getFieldProps("password")}
              error={
                formik.touched.password ? formik.errors.password : undefined
              }
              disabled={isLoading}
            />
            <Input
              id="confirm_password"
              type="password"
              placeholder="Konfirmasi password"
              icon="🔒"
              {...formik.getFieldProps("confirm_password")}
              error={
                formik.touched.confirm_password
                  ? formik.errors.confirm_password
                  : undefined
              }
              disabled={isLoading}
            />

            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !formik.isValid}
              className="w-full bg-red-500 hover:bg-red-600 mt-6"
            >
              Registrasi
            </Button>
          </form>

          <div className="text-center text-sm">
            Sudah punya akun?
            <Link
              to="/login"
              className="font-medium text-red-600 hover:text-red-500 ml-1"
            >
              Login di sini
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-gray-100 relative">
        <div className="flex items-center justify-center h-full"></div>
      </div>
    </div>
  );
}
