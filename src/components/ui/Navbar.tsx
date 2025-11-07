import { NavLink } from "react-router";

export default function Navbar() {
  const navItems = [
    { name: "Top Up", path: "/transaction/topup" },
    { name: "Transaction", path: "/transaction/history" },
    { name: "Akun", path: "/profile" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex">
          <NavLink to="/" className="flex items-center font-bold">
            <span className="mr-2 text-2xl">
              <img src="/Logo.png" alt="SIMS PPOB" className="w-8" />
            </span>{" "}
            SIMS PPOB
          </NavLink>
        </div>
        <nav className="flex space-x-4 lg:space-x-10">
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
  );
}
