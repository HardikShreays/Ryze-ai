import React from "react";

export type SidebarItem = {
  label: string;
  id?: string;
};

export type SidebarProps = {
  title?: string;
  items: SidebarItem[];
  children?: React.ReactNode;
};

export const Sidebar: React.FC<SidebarProps> = ({ title, items, children }) => {
  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-gray-50">
      {title && (
        <div className="border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        </div>
      )}
      <nav className="flex flex-col gap-0.5 px-2 py-2">
        {items.map((item, i) => (
          <div
            key={item.id ?? i}
            className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {item.label}
          </div>
        ))}
      </nav>
      {children && <div className="border-t border-gray-200 px-4 py-3">{children}</div>}
    </aside>
  );
};
