import { createBrowserRouter, Outlet, useNavigate } from "react-router";
import { RouterProvider } from "react-router";
import { useEffect } from "react";
import Profile from "./app/Profile/page";
import Home from "./app/Home/page";
import Registration from "./app/Auth/Registration/page";
import Login from "./app/Auth/Login/page";
import TransactionTopup from "./app/Transaction/Topup/page";
import TransactionPayment from "./app/Transaction/Payment/page";
import TransactionHistory from "./app/Transaction/History/page";
import NotFound from "./app/NotFound/page";
import { jwtDecode } from "jwt-decode";
import MainLayout from "./components/layout/MainLayout";

interface JwtPayload {
  exp?: number;
}

function PrivateWrapper() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken: JwtPayload = jwtDecode(token);
      const currentTime = new Date().getTime() / 1000;

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        console.warn("JWT expired. Logging out...");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error(
        "Failed to decode JWT or malformed token. Logging out...",
        error,
      );
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }
  }, [token, navigate]);

  return token ? (
    <MainLayout>
      <Outlet />
    </MainLayout>
  ) : null;
}

const router = createBrowserRouter([
  { path: "/registration", element: <Registration /> },
  { path: "/login", element: <Login /> },
  {
    element: <PrivateWrapper />,
    children: [
      { path: "*", element: <NotFound /> },
      { index: true, element: <Home /> },
      { path: "/profile", element: <Profile /> },
      { path: "/transaction/topup", element: <TransactionTopup /> },
      {
        path: "/transaction/payment/:serviceCode",
        element: <TransactionPayment />,
      },
      { path: "/transaction/history", element: <TransactionHistory /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
