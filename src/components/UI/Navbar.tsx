import { NavLink } from "react-router";

export default function Navbar() {
  const navItems = [
    { name: "Top Up", path: "/transaction/topup" },
    { name: "Transaction", path: "/transaction/history" },
    { name: "Akun", path: "/profile" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex">
          <NavLink to="/" className="font-bold flex items-center">
            <span className="mr-2 text-2xl">
              <img src="/Logo.png" alt="SIMS PPOB" className="w-8" />
            </span>{" "}
            SIMS PPOB
          </NavLink>
        </div>
        <nav className="flex space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-gray-600 hover:text-red-500 font-medium transition duration-150
                 ${isActive ? "text-red-600" : ""}`
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
