import { NavLink } from "react-router";
import { Add, Home, History, Person } from "@mui/icons-material";

export default function Navbar() {
  const navItems = [
    { name: "Top Up", path: "/transaction/topup" },
    { name: "Transaction", path: "/transaction/history" },
    { name: "Akun", path: "/profile" },
  ];

  const bottomNavItems = [
    { name: "Home", path: "/", icon: <Home /> },
    { name: "Top Up", path: "/transaction/topup", icon: <Add /> },
    { name: "Transaction", path: "/transaction/history", icon: <History /> },
    { name: "Akun", path: "/profile", icon: <Person /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 mb-6 bg-white shadow-md sm:mb-0">
        <div className="mx-auto hidden h-16 max-w-7xl items-center justify-between px-4 sm:flex sm:px-6 lg:px-8">
          <div className="flex">
            <NavLink to="/" className="flex items-center font-bold">
              <span className="mr-2 text-2xl">
                <img src="/Logo.png" alt="SIMS PPOB" className="w-8" />
              </span>{" "}
              SIMS PPOB
            </NavLink>
          </div>
          <nav className="space-x-4 lg:space-x-10">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `font-medium text-gray-600 transition duration-150 hover:text-red-500 ${isActive ? "text-red-600" : ""}`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <nav className="fixed right-0 bottom-0 left-0 z-40 bg-white shadow-lg sm:hidden">
        <div className="flex h-16 w-full items-center justify-around">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 text-xs ${
                  isActive ? "text-red-600" : "text-gray-500 hover:text-red-500"
                }`
              }
            >
              <span className="mb-1 text-xl">{item.icon}</span>{" "}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
