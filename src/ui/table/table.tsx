"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from "react";

// Type for a column definition
export interface Column<T> {
  key: keyof T | string; // column key (data index)
  title: string; // column header label
  width?: string | number; // optional column width
  minWidth?: string | number; // optional minimum width
  className?: string; // optional cell class
  headerClassName?: string; // optional header class
  type?: "status" | "default"; // custom type for rendering
  render?: (value: any, record: T) => ReactNode; // custom render function
}

// Props for the Table component
export interface TableProps<T> {
  columns?: Column<T>[];
  data: T[];
  className?: string;
  showHeader?: boolean;
  hover?: boolean;
  striped?: boolean;
  bordered?: boolean;
  rounded?: boolean;
  minWidth?: string | number; // ✅ added missing prop
}

const Table = <T extends Record<string, any>>({
  columns = [],
  data = [],
  className = "",
  showHeader = true,
  hover = true,
  striped = false,
  bordered = true,
  rounded = true,
  minWidth = "800px",
}: TableProps<T>) => {
  // Get status colors
  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      submitted: "text-blue-600 bg-blue-50 border border-blue-200",
      "in review": "text-orange-600 bg-orange-50 border border-orange-200",
      draft: "text-gray-600 bg-gray-50 border border-gray-200",
      approved: "text-green-600 bg-green-50 border border-green-200",
      rejected: "text-red-600 bg-red-50 border border-red-200",
      pending: "text-yellow-600 bg-yellow-50 border border-yellow-200",
    };

    return (
      statusColors[status?.toLowerCase()] ||
      "text-gray-600 bg-gray-50 border border-gray-200"
    );
  };

  // Render cell content
  const renderCellContent = (item: T, column: Column<T>): ReactNode => {
    const value = item[column.key as keyof T];

    if (column.render) {
      return column.render(value, item);
    }

    if (column.type === "status" && typeof value === "string") {
      return (
        <span
          className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
            value
          )}`}
        >
          {value}
        </span>
      );
    }

    return value as ReactNode;
  };

  const tableClasses = `w-full bg-white ${className}`.trim();

  const containerClasses = `
    overflow-x-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400
    ${bordered ? "shadow-sm border border-gray-200" : ""} 
    ${rounded ? "rounded-lg" : ""}
  `.trim();

  return (
    <div className="w-full">
      <div className={containerClasses}>
        <table className={tableClasses} style={{ minWidth }}>
          {showHeader && (
            <thead>
              <tr className="bg-gray-50 border-b border-[#f5f5f5]">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs sm:text-base font-semibold text-gray-900 whitespace-nowrap ${
                      column.headerClassName || ""
                    }`}
                    style={{ width: column.width, minWidth: column.minWidth }}
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className={`${striped ? "" : "divide-y divide-[#f5f5f5]"}`}>
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  ${
                    hover
                      ? "hover:bg-gray-50 transition-colors duration-200"
                      : ""
                  }
                  ${striped && rowIndex % 2 === 1 ? "bg-gray-50" : ""}
                `}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-base whitespace-nowrap ${
                      column.className || "text-gray-900"
                    }`}
                  >
                    {renderCellContent(item, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">No data available</div>
      )}
    </div>
  );
};

export default Table;
