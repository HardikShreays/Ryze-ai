import React from "react";

export type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  type?: "text" | "number" | "email" | "password";
  disabled?: boolean;
  onChange?: (value: string) => void;
};

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  type = "text",
  disabled = false,
  onChange,
}) => {
  return (
    <label className="flex flex-col gap-1 text-sm text-gray-700">
      {label && <span className="font-medium">{label}</span>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      />
    </label>
  );
};
