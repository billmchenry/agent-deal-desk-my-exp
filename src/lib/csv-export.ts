import type { ReactNode } from "react";

export interface CsvColumnDef<T> {
  key: keyof T;
  header: string;
  type: "string" | "number" | "currency" | "date" | "badge";
}

function escapeField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n") || value.includes("\r")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function extractRaw<T>(row: T, col: CsvColumnDef<T>): string {
  const raw = row[col.key];
  if (raw == null) return "";

  switch (col.type) {
    case "currency":
    case "number": {
      const n = typeof raw === "number" ? raw : parseFloat(String(raw));
      return isNaN(n) ? String(raw) : n.toFixed(2);
    }
    case "date": {
      const s = String(raw);
      if (s === "-" || !s) return "";
      // Try to parse MM/DD/YYYY → YYYY-MM-DD
      const parts = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (parts) return `${parts[3]}-${parts[1]}-${parts[2]}`;
      // Already ISO or other format
      return s;
    }
    default:
      return String(raw);
  }
}

export function exportToCsv<T>(
  rows: T[],
  columns: CsvColumnDef<T>[],
  filename: string
): void {
  const header = columns.map((c) => escapeField(c.header)).join(",");
  const body = rows
    .map((row) =>
      columns.map((col) => escapeField(extractRaw(row, col))).join(",")
    )
    .join("\r\n");

  const csvContent = `\uFEFF${header}\r\n${body}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
