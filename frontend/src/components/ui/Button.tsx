import React from "react";

export type ButtonVariant = "primary" | "secondary";

export type ButtonProps = {
  variant: ButtonVariant;
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const baseButtonClass =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    baseButtonClass +
    " bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed",
  secondary:
    baseButtonClass +
    " bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
};

export const Button: React.FC<ButtonProps> = ({
  variant,
  label,
  onClick,
  type = "button",
  disabled = false,
}) => {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={variantClass[variant]}>
      {label}
    </button>
  );
};
