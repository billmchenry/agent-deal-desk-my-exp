import { useState, useMemo, useCallback, type ReactNode } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Filter,
  Download,
  Columns3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { exportToCsv, type CsvColumnDef } from "@/lib/csv-export";
import { cn } from "@/lib/utils";

// ---------- Types ----------

export interface ColumnDef<T> {
  key: keyof T;
  /** Optional unique id for UI identity (visibility, rendering keys). Use when multiple columns share the same data key. */
  id?: string;
  header: string; // i18n key
  type: "string" | "number" | "currency" | "date" | "badge";
  sortable?: boolean;
  filterable?: boolean;
  defaultVisible?: boolean;
  /** Freeze this column to the right edge of the table */
  stickyRight?: boolean;
  /** For currency columns: key in data row that holds currency code (e.g. "USD") */
  currencyCodeKey?: keyof T;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchableKeys?: (keyof T)[];
  onRowClick?: (row: T) => void;
  defaultPageSize?: number;
  defaultSort?: { key: keyof T; direction: "asc" | "desc" };
  csvFilename?: string;
  mobileCardRender?: (row: T) => ReactNode;
}

type SortDir = "asc" | "desc" | null;

function getColumnId<T>(col: ColumnDef<T>): string {
  return col.id ?? String(col.key);
}

// ---------- Helpers ----------

function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
      return <Badge className="bg-exp-green/10 text-exp-green border-exp-green/20 hover:bg-exp-green/10">Paid</Badge>;
    case "pending":
      return <Badge className="bg-exp-gold/10 text-exp-gold border-exp-gold/20 hover:bg-exp-gold/10">Pending</Badge>;
    case "withdrawn":
      return <Badge className="bg-muted text-muted-foreground hover:bg-muted">Withdrawn</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

// ---------- Component ----------

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchableKeys,
  onRowClick,
  defaultPageSize = 25,
  defaultSort,
  csvFilename,
  mobileCardRender,
}: DataTableProps<T>) {
  const { formatCurrency, formatDate, formatNumber } = useFormatters();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // --- State ---
  const [globalSearch, setGlobalSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(defaultSort?.key ?? null);
  const [sortDir, setSortDir] = useState<SortDir>(defaultSort?.direction ?? null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [columnEnumFilters, setColumnEnumFilters] = useState<Record<string, Set<string>>>({});
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [page, setPage] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    columns.forEach((c) => {
      if (c.defaultVisible !== false) initial.add(getColumnId(c));
    });
    return initial;
  });

  // --- Unique values for enum/badge columns ---
  const uniqueValues = useMemo(() => {
    const map: Record<string, string[]> = {};
    columns.forEach((col) => {
      if (col.filterable && col.type === "badge") {
        const vals = new Set<string>();
        data.forEach((row) => {
          const v = String(row[col.key] ?? "");
          if (v) vals.add(v);
        });
        map[String(col.key)] = Array.from(vals).sort();
      }
    });
    return map;
  }, [data, columns]);

  // --- Data Pipeline ---
  const filteredSorted = useMemo(() => {
    let result = [...data];

    // 1. Global search
    if (globalSearch && searchableKeys?.length) {
      const q = globalSearch.toLowerCase();
      result = result.filter((row) =>
        searchableKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q))
      );
    }

    // 2. Column filters
    for (const [key, val] of Object.entries(columnFilters)) {
      if (val) {
        const q = val.toLowerCase();
        result = result.filter((row) =>
          String(row[key] ?? "").toLowerCase().includes(q)
        );
      }
    }
    for (const [key, vals] of Object.entries(columnEnumFilters)) {
      if (vals.size > 0) {
        result = result.filter((row) => vals.has(String(row[key] ?? "")));
      }
    }

    // 3. Sort
    if (sortKey && sortDir) {
      const col = columns.find((c) => c.key === sortKey);
      result.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        let cmp = 0;
        if (col?.type === "number" || col?.type === "currency") {
          cmp = (Number(aVal) || 0) - (Number(bVal) || 0);
        } else if (col?.type === "date") {
          const da = aVal === "-" ? 0 : new Date(String(aVal)).getTime();
          const db = bVal === "-" ? 0 : new Date(String(bVal)).getTime();
          cmp = da - db;
        } else {
          cmp = String(aVal ?? "").localeCompare(String(bVal ?? ""));
        }
        return sortDir === "desc" ? -cmp : cmp;
      });
    }

    return result;
  }, [data, globalSearch, searchableKeys, columnFilters, columnEnumFilters, sortKey, sortDir, columns]);

  const totalFiltered = filteredSorted.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const pageData = filteredSorted.slice(safePage * pageSize, (safePage + 1) * pageSize);

  // Reset page when filters change
  const setGlobalSearchAndReset = useCallback((v: string) => {
    setGlobalSearch(v);
    setPage(0);
  }, []);

  // --- Sort handler ---
  const handleSort = useCallback((key: keyof T) => {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortDir(null); setSortKey(null); }
      else { setSortDir("asc"); setSortKey(key); }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(0);
  }, [sortKey, sortDir]);

  // --- Format display value ---
  const formatCell = useCallback((col: ColumnDef<T>, row: T): ReactNode => {
    if (col.render) return col.render(row[col.key], row);
    const raw = row[col.key];
    switch (col.type) {
      case "currency": {
        const code = col.currencyCodeKey ? String(row[col.currencyCodeKey] ?? "USD") : "USD";
        return `${formatCurrency(Number(raw) || 0)} ${code}`;
      }
      case "number":
        return formatNumber(Number(raw) || 0, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      case "date": {
        const s = String(raw ?? "");
        return s === "-" ? "-" : formatDate(s);
      }
      case "badge":
        return getStatusBadge(String(raw ?? ""));
      default:
        return String(raw ?? "");
    }
  }, [formatCurrency, formatDate, formatNumber]);

  // --- CSV export ---
  const handleCsvExport = useCallback(() => {
    if (!csvFilename) return;
    const csvCols: CsvColumnDef<T>[] = columns
      .filter((c) => visibleColumns.has(getColumnId(c)))
      .map((c) => ({ key: c.key, header: t(c.header), type: c.type }));
    exportToCsv(filteredSorted, csvCols, csvFilename);
  }, [csvFilename, columns, visibleColumns, filteredSorted, t]);

  // --- Column filter popover ---
  const renderColumnFilter = (col: ColumnDef<T>) => {
    const key = String(col.key);
    if (col.type === "badge") {
      const vals = uniqueValues[key] || [];
      const selected = columnEnumFilters[key] || new Set<string>();
      return (
        <div className="space-y-2 p-2 min-w-[140px]">
          {vals.map((v) => (
            <label key={v} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={selected.has(v)}
                onCheckedChange={(checked) => {
                  setColumnEnumFilters((prev) => {
                    const next = new Set(prev[key] || []);
                    if (checked) next.add(v);
                    else next.delete(v);
                    const updated = { ...prev };
                    if (next.size === 0) delete updated[key];
                    else updated[key] = next;
                    return updated;
                  });
                  setPage(0);
                }}
              />
              {v}
            </label>
          ))}
        </div>
      );
    }
    return (
      <div className="p-2">
        <Input
          placeholder={t("filter.search")}
          value={columnFilters[key] || ""}
          onChange={(e) => {
            setColumnFilters((prev) => ({ ...prev, [key]: e.target.value }));
            setPage(0);
          }}
          className="h-8 text-xs"
        />
      </div>
    );
  };

  // --- Visible column defs ---
  const visibleCols = columns.filter((c) => visibleColumns.has(getColumnId(c)));

  // --- Toolbar ---
  const toolbar = (
    <div className="flex items-center gap-2 flex-wrap mb-3">
      {!isMobile && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 text-xs h-8">
              <Columns3 className="h-3.5 w-3.5" />
              {t("txn.columns")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
            {columns.map((col) => {
              const colId = getColumnId(col);
              return (
                <DropdownMenuCheckboxItem
                  key={colId}
                  checked={visibleColumns.has(colId)}
                  onCheckedChange={(checked) => {
                    setVisibleColumns((prev) => {
                      const next = new Set(prev);
                      if (checked) next.add(colId);
                      else next.delete(colId);
                      return next;
                    });
                  }}
                >
                  {t(col.header)}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {csvFilename && (
        <Button variant="outline" size="sm" className="gap-2 text-xs h-8" onClick={handleCsvExport}>
          <Download className="h-3.5 w-3.5" />
          {t("txn.downloadCsv")}
        </Button>
      )}
      <span className="text-sm text-muted-foreground ms-auto" aria-live="polite">
        {totalFiltered} {t("txn.results")}
      </span>
    </div>
  );

  // --- Pagination ---
  const pagination = (
    <div className="flex items-center justify-between gap-4 flex-wrap mt-3 px-1">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{t("txn.rowsPerPage")}</span>
        <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(0); }}>
          <SelectTrigger className="h-8 w-[70px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((n) => (
              <SelectItem key={n} value={String(n)}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {t("txn.pageOf").replace("{page}", String(safePage + 1)).replace("{total}", String(totalPages))}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={safePage === 0}
          onClick={() => setPage((p) => p - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={safePage >= totalPages - 1}
          onClick={() => setPage((p) => p + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // --- Mobile card view ---
  if (isMobile && mobileCardRender) {
    return (
      <div>
        {toolbar}
        {pageData.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">{t("txn.noResults")}</p>
        ) : (
          <div className="space-y-2">
            {pageData.map((row, i) => (
              <button
                key={i}
                type="button"
                className="w-full text-left rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
                onClick={() => onRowClick?.(row)}
              >
                {mobileCardRender(row)}
              </button>
            ))}
          </div>
        )}
        {pagination}
      </div>
    );
  }

  // --- Desktop table ---
  return (
    <div>
      {toolbar}
      <div className="border rounded-lg overflow-hidden">
        <ScrollArea className="w-full">
          <div style={{ minWidth: `${visibleCols.length * 130}px` }}>
            <Table role="grid">
              <TableHeader>
                <TableRow className="bg-muted/50" role="row">
                  {visibleCols.map((col) => {
                    const isSorted = sortKey === col.key;
                    const ariaSort = isSorted
                      ? sortDir === "asc" ? "ascending" : sortDir === "desc" ? "descending" : "none"
                      : undefined;
                    return (
                      <TableHead
                        key={getColumnId(col)}
                        role="columnheader"
                        aria-sort={ariaSort}
                        className={cn(
                          "font-semibold",
                          (col.type === "number" || col.type === "currency") && "text-right",
                          col.stickyRight && "sticky right-0 z-10 bg-muted/95 backdrop-blur-sm shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]"
                        )}
                      >
                        <div className={cn("flex items-center gap-1", (col.type === "number" || col.type === "currency") && "justify-end")}>
                          {col.sortable ? (
                            <button
                              className="flex items-center gap-1 hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring rounded px-1 -ml-1"
                              onClick={() => handleSort(col.key)}
                              aria-label={`Sort by ${t(col.header)} ${isSorted && sortDir === "asc" ? "descending" : "ascending"}`}
                            >
                              {t(col.header)}
                              {isSorted && sortDir === "asc" && <ChevronUp className="h-3.5 w-3.5" />}
                              {isSorted && sortDir === "desc" && <ChevronDown className="h-3.5 w-3.5" />}
                              {(!isSorted || !sortDir) && <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />}
                            </button>
                          ) : (
                            <span>{t(col.header)}</span>
                          )}
                          {col.filterable && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  className={cn(
                                    "p-1 rounded hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                                    (columnFilters[String(col.key)] || columnEnumFilters[String(col.key)]?.size) && "text-primary"
                                  )}
                                  aria-label={`Filter ${t(col.header)}`}
                                >
                                  <Filter className="h-3 w-3" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent align="start" className="w-auto p-0">
                                {renderColumnFilter(col)}
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleCols.length} className="text-center py-8 text-muted-foreground">
                      {t("txn.noResults")}
                    </TableCell>
                  </TableRow>
                ) : (
                  pageData.map((row, i) => (
                    <TableRow
                      key={i}
                      role="row"
                      tabIndex={onRowClick ? 0 : undefined}
                      className={cn(
                        onRowClick && "cursor-pointer hover:bg-muted/50",
                        "min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                      )}
                      onClick={() => onRowClick?.(row)}
                      onKeyDown={(e) => {
                        if (onRowClick && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          onRowClick(row);
                        }
                      }}
                    >
                      {visibleCols.map((col) => (
                        <TableCell key={`${getColumnId(col)}-${i}`} className={cn(
                          col.type === "string" && "max-w-[200px] truncate",
                          (col.type === "number" || col.type === "currency") && "text-right tabular-nums",
                          col.stickyRight && "sticky right-0 z-10 bg-card/95 backdrop-blur-sm shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]"
                        )}>
                          {formatCell(col, row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      {pagination}
    </div>
  );
}
