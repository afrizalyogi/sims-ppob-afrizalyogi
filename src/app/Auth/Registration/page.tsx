import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AlternateEmail, Person, LockOutline } from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  registration,
  selectAuthStatus,
  selectAuthError,
  clearAuthStatus,
} from "../../../features/authSlice";

import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

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
      <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-10 text-center">
            <div className="mx-auto flex gap-2">
              <img src="/Logo.png" alt="Logo" className="h-8 w-8" />
              <h2 className="text-xl font-bold">SIMS PPOB</h2>
            </div>
            <h1 className="mb-4 text-3xl font-extrabold text-gray-900">
              Lengkapi data untuk membuat akun
            </h1>
          </div>

          <form className="mt-8 space-y-4" onSubmit={formik.handleSubmit}>
            <Input
              id="email"
              type="email"
              placeholder="Masukkan email anda"
              icon={<AlternateEmail />}
              {...formik.getFieldProps("email")}
              error={formik.touched.email ? formik.errors.email : undefined}
              disabled={isLoading}
            />
            <Input
              id="first_name"
              type="text"
              placeholder="Nama depan"
              icon={<Person />}
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
              icon={<Person />}
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
              icon={<LockOutline />}
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
              icon={<LockOutline />}
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
              className="mt-6 w-full bg-red-500 hover:bg-red-600"
            >
              Registrasi
            </Button>
          </form>

          <div className="text-center text-sm">
            Sudah punya akun?
            <Link
              to="/login"
              className="ml-1 font-medium text-red-600 hover:text-red-500"
            >
              Login di sini
            </Link>
          </div>
        </div>
      </div>

      <div className="relative hidden bg-gray-100 lg:block lg:w-1/2">
        <div className="flex h-full items-center justify-center">
          <img src="/Illustrasi Login.png" alt="Registrasi" />
        </div>
      </div>
    </div>
  );
}
