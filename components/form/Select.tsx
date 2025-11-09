import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder,
  onChange,
  className = "",
  value = "",
  required = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const displayText = options.find((opt) => opt.value === value)?.label || placeholder || "";

  return (
    <div className="w-full relative" ref={containerRef}>
      <div
        className={`flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-1 shadow-theme-xs cursor-pointer dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 ${className} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`${value ? "text-gray-800 dark:text-white/90" : "text-gray-400 dark:text-gray-400"} truncate`}>
          {displayText || ""}
        </span>
        <svg
          className={`w-5 h-5 stroke-current ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-40 mt-0 w-full max-h-60 overflow-y-auto rounded-lg bg-white shadow-sm dark:bg-gray-900">
          {options.map((option, index) => (
            <div
              key={option.value}
              className={`cursor-pointer px-3 py-2 hover:bg-primary/5 ${
                index < options.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >
              <span className="text-gray-800 dark:text-white/90">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
