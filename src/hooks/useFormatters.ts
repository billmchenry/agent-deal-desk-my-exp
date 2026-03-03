import { useLocale } from "@/contexts/LocaleContext";
import {
  formatNumber as _formatNumber,
  formatCurrency as _formatCurrency,
  formatDate as _formatDate,
  formatTime as _formatTime,
} from "@/lib/formatters";

export function useFormatters() {
  const { numberFormat, dateFormat, timeFormat } = useLocale();

  return {
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
      _formatNumber(value, numberFormat, options),

    formatCurrency: (value: number, options?: { compact?: boolean; decimals?: number }) =>
      _formatCurrency(value, numberFormat, options),

    formatDate: (date: Date | string) =>
      _formatDate(date, dateFormat),

    formatTime: (date: Date | string) =>
      _formatTime(date, timeFormat),
  };
}
