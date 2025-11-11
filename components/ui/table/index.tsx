import React, { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode;
  className?: string;
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode;
  className?: string;
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={`px-5 py-4 text-gray-800 dark:text-gray-300 ${className}`}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

// Th Component
const Th: React.FC<TableCellProps> = ({
  children,
  className,
}) => {
  return <th className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400 ${className}`}>{children}</th>;
};

// Td Component
const Td: React.FC<TableCellProps> = ({
  children,
  className,
}) => {
  return <td className={`px-5 py-4 sm:px-6 text-start text-theme-lg text-gray-800 dark:text-gray-300 ${className}`}>{children}</td>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 ${className}`}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, Th, Td, TableCell };