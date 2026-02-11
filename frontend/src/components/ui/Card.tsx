import React from "react";

export type CardProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ title, description, children }) => {
  return (
    <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {(title || description) && (
        <header className="border-b border-gray-100 px-4 py-3">
          {title && <h2 className="text-sm font-semibold text-gray-900">{title}</h2>}
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
        </header>
      )}
      <div className="px-4 py-3 text-sm text-gray-900">{children}</div>
    </section>
  );
};
