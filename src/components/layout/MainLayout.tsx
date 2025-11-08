import React from "react";
import Navbar from "../ui/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 pb-16 sm:pb-0">
      <Navbar />
      <main className="flex grow">{children}</main>
    </div>
  );
}
