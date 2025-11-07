import { useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AlternateEmail, LockOutline } from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  login,
  selectAuthStatus,
  selectAuthError,
  clearAuthStatus,
} from "../../../features/authSlice";

import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Format Email tidak valid")
    .required("Email wajib diisi"),
  password: Yup.string().required("Password wajib diisi"),
});

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const isLoading = status === "loading";

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }

    if (status === "failed" && error) {
      alert(`Login Gagal: ${error}`);
      dispatch(clearAuthStatus());
    }
  }, [isAuthenticated, status, error, navigate, dispatch]);

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
              Masuk atau buat akun <br /> untuk memulai
            </h1>
          </div>

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
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
                id="password"
                type="password"
                placeholder="Masukkan password anda"
                icon={<LockOutline />}
                {...formik.getFieldProps("password")}
                error={
                  formik.touched.password ? formik.errors.password : undefined
                }
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !formik.isValid}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              Masuk
            </Button>
          </form>

          <div className="text-center text-sm">
            Belum punya akun?
            <Link
              to="/registration"
              className="ml-1 font-medium text-red-600 hover:text-red-500"
            >
              Registrasi di sini
            </Link>
          </div>
        </div>
      </div>

      <div className="relative hidden bg-gray-100 lg:block lg:w-1/2">
        <div className="flex h-full items-center justify-center">
          <img src="/Illustrasi Login.png" alt="Login" />
        </div>
      </div>
    </div>
  );
}
