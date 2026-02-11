import React from "react";

export type ModalProps = {
  title: string;
  open: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ title, open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Escape" && onClose?.()}
        aria-label="Close modal"
      />
      <div className="relative z-10 w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-xl">
        <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              ×
            </button>
          )}
        </header>
        <div className="px-4 py-3 text-sm text-gray-900">{children}</div>
      </div>
    </div>
  );
};
