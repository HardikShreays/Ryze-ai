import React from "react";

export type NavbarProps = {
  title: string;
  subtitle?: string;
};

export const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </header>
  );
};
