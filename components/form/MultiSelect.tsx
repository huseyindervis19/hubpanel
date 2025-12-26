"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { ChevronDownIcon } from "@/icons";

interface Option {
  value: string;
  text: string;
  selected?: boolean;
  label?: string;
}

interface MultiSelectProps {
  label?: string;
  options: Option[];
  placeholder?: string;
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  placeholder,
  defaultSelected = [],
  onChange,
  disabled = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultSelected);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedOptions(defaultSelected);
  }, [defaultSelected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (optionValue: string) => {
    const isCurrentlySelected = selectedOptions.includes(optionValue);
    const newSelectedOptions = isCurrentlySelected
      ? selectedOptions.filter((value) => value !== optionValue)
      : [...selectedOptions, optionValue];

    setSelectedOptions(newSelectedOptions);
    if (onChange) onChange(newSelectedOptions);
  };

  const removeOption = (value: string) => {
    const newSelectedOptions = selectedOptions.filter((opt) => opt !== value);
    setSelectedOptions(newSelectedOptions);
    if (onChange) onChange(newSelectedOptions);
  };

  const selectedOptionsDetails = useMemo(() => {
    return selectedOptions
      .map((value) => {
        const option = options.find((opt) => opt.value === value);
        return { value, text: option?.text || "" };
      })
      .filter((detail) => detail.text);
  }, [selectedOptions, options]);

  const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -10, scaleY: 0.95, transition: { duration: 0.2 }, transitionEnd: { display: "none" } },
    visible: { opacity: 1, y: 0, scaleY: 1, transition: { duration: 0.2 }, display: "block" },
  };

  return (
    <div className="w-full" ref={containerRef}>
      {label && <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{label}</label>}

      <div className="relative z-20 inline-block w-full">
        <div className="relative flex flex-col items-center">
          {/* Input box */}
          <div
            onClick={toggleDropdown}
            className={`w-full ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div
              className={`flex flex-wrap items-center gap-1 h-11 border py-1.5 px-3 shadow-theme-xs outline-hidden transition
              ${isOpen ? "rounded-t-lg rounded-b-none" : "rounded-lg"}
              ${disabled
                  ? "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700 opacity-70"
                  : "bg-white border-gray-300 focus:border-brand-300 focus:shadow-focus-ring dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-300"
                }`}
            >
              {/* Selected tags */}
              <div className="flex flex-wrap gap-1 flex-1 overflow-hidden">
                {selectedOptionsDetails.length > 0 ? (
                  selectedOptionsDetails.map((detail) => (
                    <div
                      key={detail.value}
                      className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white/90 px-2 py-0.5 rounded-full text-sm whitespace-nowrap"
                    >
                      <span className="truncate max-w-[120px]">{detail.text}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOption(detail.value);
                        }}
                        className="text-gray-500 hover:text-gray-400 dark:text-gray-400"
                        disabled={disabled}
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 dark:text-gray-400 truncate">{placeholder || ""}</span>
                )}
              </div>

              {/* Dropdown arrow */}
              <div className="flex items-center pl-2">
                <ChevronDownIcon />
              </div>
            </div>
          </div>

          {/* Dropdown menu */}
          <motion.div
            initial={false}
            animate={isOpen ? "visible" : "hidden"}
            variants={dropdownVariants}
            style={{ originY: 0 }}
            className="absolute z-40 w-full max-h-60 overflow-y-auto bg-white shadow-sm top-[100%] -mt-px rounded-b-lg rounded-t-none border border-gray-300 dark:bg-gray-900 dark:border-gray-700"
          >
            {options.length > 0 ? (
              options.map((option, index) => {
                const isSelected = selectedOptions.includes(option.value);
                return (
                  <div key={option.value}>
                    <div
                      className={`cursor-pointer px-3 py-2 hover:bg-primary/5 ${isSelected ? "border-b border-gray-200 dark:border-gray-800" : ""}`}
                      onClick={() => handleSelect(option.value)}
                    >
                      <span className="text-gray-800 dark:text-white/90">{option.text}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No options available.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
