import { useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  login,
  selectAuthStatus,
  selectAuthError,
  clearAuthStatus,
} from "../../../features/authSlice";

import Input from "../../../components/UI/Input";
import Button from "../../../components/UI/Button";

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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-red-500">SIMS PPOB</h2>
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
              Masuk atau buat akun untuk memulai
            </h1>
          </div>

          <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
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
                id="password"
                type="password"
                placeholder="Masukkan password anda"
                icon="🔒"
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
              className="font-medium text-red-600 hover:text-red-500 ml-1"
            >
              Registrasi di sini
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
