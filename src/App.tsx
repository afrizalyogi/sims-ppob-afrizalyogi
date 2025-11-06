import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Profile from "./app/Profile/page";
import Home from "./app/Home/page";
import Registration from "./app/Auth/Registration/page";
import Login from "./app/Auth/Login/page";
import TransactionTopup from "./app/Transaction/Topup/page";
import TransactionPayment from "./app/Transaction/Payment/page";
import TransactionHistory from "./app/Transaction/History/page";
import NotFound from "./app/NotFound/page";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/registration", element: <Registration /> },
  { path: "/login", element: <Login /> },
  { path: "/profile", element: <Profile /> },
  { path: "/topup", element: <TransactionTopup /> },
  { path: "/payment", element: <TransactionPayment /> },
  { path: "/history", element: <TransactionHistory /> },
  { path: "*", element: <NotFound /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
