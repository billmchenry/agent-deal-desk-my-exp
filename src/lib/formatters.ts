import { format as dateFnsFormat, parse } from "date-fns";
import type { DateFormatOption, TimeFormatOption, NumberFormatOption } from "@/contexts/LocaleContext";

/* ── Number Formatting ── */

export function formatNumber(
  value: number,
  numberFormat: NumberFormatOption,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(numberFormat, options).format(value);
}

export function formatCurrency(
  value: number,
  numberFormat: NumberFormatOption,
  options?: { compact?: boolean; decimals?: number; symbol?: boolean }
): string {
  const { compact = false, decimals = 2, symbol = false } = options ?? {};
  const prefix = symbol ? "$" : "";

  if (compact) {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) {
      return prefix + formatNumber(value / 1_000_000, numberFormat, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) + "M";
    }
    if (abs >= 1_000) {
      return prefix + formatNumber(value / 1_000, numberFormat, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) + "K";
    }
  }

  return prefix + formatNumber(value, numberFormat, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/* ── Date Formatting ── */

const dateFormatPatterns: Record<DateFormatOption, string> = {
  "MM/DD/YYYY": "MM/dd/yyyy",
  "DD/MM/YYYY": "dd/MM/yyyy",
  "YYYY/MM/DD": "yyyy/MM/dd",
  "DD-MM-YYYY": "dd-MM-yyyy",
  "MM-DD-YYYY": "MM-dd-yyyy",
  "YYYY-MM-DD": "yyyy-MM-dd",
  "DD Mon, YYYY": "dd MMM, yyyy",
};

export function formatDate(
  date: Date | string,
  dateFormatOption: DateFormatOption
): string {
  let d: Date;
  if (typeof date === "string") {
    // Try to parse common formats
    if (date === "-" || !date) return date || "-";
    // Try MM/DD/YYYY first
    try {
      d = parse(date, "MM/dd/yyyy", new Date());
      if (isNaN(d.getTime())) {
        d = new Date(date);
      }
    } catch {
      d = new Date(date);
    }
  } else {
    d = date;
  }

  if (isNaN(d.getTime())) return typeof date === "string" ? date : "-";

  return dateFnsFormat(d, dateFormatPatterns[dateFormatOption]);
}

/* ── Time Formatting ── */

export function formatTime(
  date: Date | string,
  timeFormat: TimeFormatOption
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return typeof date === "string" ? date : "-";

  if (timeFormat === "24h") {
    return dateFnsFormat(d, "HH:mm");
  }
  return dateFnsFormat(d, "h:mm a");
}
