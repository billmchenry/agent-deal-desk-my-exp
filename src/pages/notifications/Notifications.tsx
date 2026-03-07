import { useState, useMemo } from "react";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Download, Filter, ChevronRight, ChevronLeft, Search, Info,
  Phone, Mail, X, ChevronUp,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { cn } from "@/lib/utils";

// ── Types ──

type NotificationType = "Information" | "Action Required" | "Recognition";
type MilestoneType =
  | "Transaction Payment" | "Transaction Status" | "Invoice" | "Invoice Paid" | "Payment"
  | "Draft DA"
  | "First Transaction" | "Capping" | "Highest Price" | "Becoming FLQA" | "Icon";

interface NotificationItem {
  id: string;
  tab: "activity" | "recognition";
  type: NotificationType;
  milestone?: MilestoneType;
  message: string;
  giftLink?: boolean;
  timestamp: string;
  // Detail fields
  agentName?: string;
  agentId?: string;
  agentLevel?: number;
  agentPhone?: string;
  agentEmail?: string;
  address?: string;
  salesPrice?: number;
  capReachedDate?: string;
  transactionNumber?: string;
}

// ── Mock Data ──

const mockNotifications: NotificationItem[] = [
  // Recognition items
  {
    id: "r1", tab: "recognition", type: "Recognition", milestone: "Capping",
    message: "Danielle Harmon in your Revenue Share group has achieved their 100% capping.",
    giftLink: true, timestamp: "03/07/2025 12:00 AM",
    agentName: "Danielle Harmon", agentId: "1080871", agentLevel: 5,
    agentPhone: "(347) 555-0638", agentEmail: "danielle.harmon@exprealty.com",
    salesPrice: 1300000, capReachedDate: "03/07/2025", transactionNumber: "3142526.1",
    address: "105-20 37th Avenue, Corona, NY 11368, US",
  },
  {
    id: "r2", tab: "recognition", type: "Recognition", milestone: "Capping",
    message: "Brittany Pride in your Revenue Share group has achieved their 100% capping.",
    giftLink: true, timestamp: "01/31/2025 12:00 AM",
    agentName: "Brittany Pride", agentId: "1092145", agentLevel: 3,
    agentPhone: "(212) 555-0147", agentEmail: "brittany.pride@exprealty.com",

    salesPrice: 950000, capReachedDate: "01/31/2025", transactionNumber: "3138921.2",
    address: "42 Elm Street, Brooklyn, NY 11201, US",
  },
  {
    id: "r3", tab: "recognition", type: "Recognition", milestone: "Capping",
    message: "Renzo Montaiuti in your Revenue Share group has achieved their 100% capping.",
    giftLink: true, timestamp: "02/26/2025 12:00 AM",
    agentName: "Renzo Montaiuti", agentId: "1075302", agentLevel: 4,
    agentPhone: "(646) 555-0289", agentEmail: "renzo.montaiuti@exprealty.com",
    salesPrice: 1150000, capReachedDate: "02/26/2025", transactionNumber: "3141078.1",
    address: "789 Park Ave, Manhattan, NY 10021, US",
  },
  {
    id: "r4", tab: "recognition", type: "Recognition", milestone: "Capping",
    message: "Mylissa Lanning in your Revenue Share group has achieved their 100% capping.",
    giftLink: true, timestamp: "02/15/2025 12:00 AM",
    agentName: "Mylissa Lanning", agentId: "1068493", agentLevel: 2,
    agentPhone: "(718) 555-0312", agentEmail: "mylissa.lanning@exprealty.com",
    salesPrice: 875000, capReachedDate: "02/15/2025", transactionNumber: "3139456.1",
    address: "156 Oak Lane, Queens, NY 11375, US",
  },
  {
    id: "r5", tab: "recognition", type: "Recognition", milestone: "First Transaction",
    message: "Carlos Rivera in your Revenue Share group has completed their first transaction!",
    giftLink: true, timestamp: "03/01/2025 12:00 AM",
    agentName: "Carlos Rivera", agentId: "1095782", agentLevel: 1,
    agentPhone: "(917) 555-0456", agentEmail: "carlos.rivera@exprealty.com",
    salesPrice: 425000, capReachedDate: "03/01/2025", transactionNumber: "3143001.1",
    address: "2200 Broadway, Bronx, NY 10468, US",
  },
  // Activity Feed items
  {
    id: "a1", tab: "activity", type: "Information", milestone: "Transaction Status",
    message: "60949 Main St, Hartford, CT 06101, US",
    timestamp: "02/04/2026 05:43 PM",
  },
  {
    id: "a2", tab: "activity", type: "Information", milestone: "Transaction Status",
    message: "35438 Meadow Lane, Hartford, CT 06101, US",
    timestamp: "02/03/2026 03:19 PM",
  },
  {
    id: "a3", tab: "activity", type: "Information", milestone: "Invoice",
    message: "73538 Park Road, Hartford, CT 06101, US",
    timestamp: "02/03/2026 03:18 PM",
  },
  {
    id: "a4", tab: "activity", type: "Information", milestone: "Transaction Payment",
    message: "35807 Elm Street, Hartford, CT 06101, US",
    timestamp: "02/03/2026 03:17 PM",
  },
  {
    id: "a5", tab: "activity", type: "Information", milestone: "Payment",
    message: "eXp Agent Stock Programs",
    timestamp: "02/02/2026 09:00 AM",
  },
  {
    id: "a6", tab: "activity", type: "Action Required", milestone: "Draft DA",
    message: "14220 River Rd, Hartford, CT 06101, US",
    timestamp: "02/01/2026 02:15 PM",
  },
  {
    id: "a7", tab: "activity", type: "Action Required", milestone: "Transaction Status",
    message: "88120 Cedar Ave, Hartford, CT 06101, US",
    timestamp: "01/30/2026 11:30 AM",
  },
];

// ── Filter config ──

const ACTIVITY_FILTER_CATEGORIES: Record<string, MilestoneType[]> = {
  Information: ["Transaction Payment", "Transaction Status", "Invoice", "Invoice Paid", "Payment"],
  "Action Required": ["Draft DA", "Transaction Status", "Invoice"],
  Recognition: ["First Transaction", "Capping", "Highest Price", "Becoming FLQA", "Icon"],
};

const RECOGNITION_FILTER_CATEGORIES: Record<string, MilestoneType[]> = {
  Recognition: ["First Transaction", "Capping", "Highest Price", "Becoming FLQA", "Icon"],
};

const PAGE_SIZE = 1000;

export default function Notifications() {
  const { t } = useTranslation();
  useDocumentTitle(t("nav.notifications"));
  const { formatCurrency, formatDate } = useFormatters();

  const [activeTab, setActiveTab] = useState<"activity" | "recognition">("activity");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [page, setPage] = useState(1);

  // Filter state
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [milestoneFilters, setMilestoneFilters] = useState<Set<MilestoneType>>(new Set());
  const [tempDateFilter, setTempDateFilter] = useState<string | null>(null);
  const [tempMilestoneFilters, setTempMilestoneFilters] = useState<Set<MilestoneType>>(new Set());

  const openFilters = () => {
    setTempDateFilter(dateFilter);
    setTempMilestoneFilters(new Set(milestoneFilters));
    setFilterOpen(true);
  };

  const applyFilters = () => {
    setDateFilter(tempDateFilter);
    setMilestoneFilters(new Set(tempMilestoneFilters));
    setPage(1);
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setTempDateFilter(null);
    setTempMilestoneFilters(new Set());
  };

  const toggleMilestone = (m: MilestoneType) => {
    setTempMilestoneFilters((prev) => {
      const next = new Set(prev);
      next.has(m) ? next.delete(m) : next.add(m);
      return next;
    });
  };

  // Filtered data
  const filtered = useMemo(() => {
    let items = mockNotifications.filter((n) => n.tab === activeTab);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter((n) => n.message.toLowerCase().includes(q));
    }
    if (milestoneFilters.size > 0) {
      items = items.filter((n) => n.milestone && milestoneFilters.has(n.milestone));
    }
    return items;
  }, [activeTab, searchQuery, milestoneFilters]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rangeStart = totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalItems);

  const filterCategories = activeTab === "activity" ? ACTIVITY_FILTER_CATEGORIES : RECOGNITION_FILTER_CATEGORIES;

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-20">
        <h1 className="text-page-title font-bold text-foreground">{t("notif.title")}</h1>

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as "activity" | "recognition"); setPage(1); }}>
          <TabsList className="bg-transparent border-b rounded-none w-full justify-start gap-4 px-0">
            <TabsTrigger
              value="activity"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-3"
            >
              {t("notif.activityFeed")}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground" aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>{t("notif.activityFeedInfo")}</TooltipContent>
              </Tooltip>
            </TabsTrigger>
            <TabsTrigger
              value="recognition"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-3"
            >
              {t("notif.recognition")}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground" aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent>{t("notif.recognitionInfo")}</TooltipContent>
              </Tooltip>
            </TabsTrigger>
          </TabsList>

          {/* Search (Activity Feed only) */}
          {activeTab === "activity" && (
            <div className="relative max-w-lg mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder={t("notif.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="pl-9"
                aria-label={t("notif.searchPlaceholder")}
              />
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center gap-2 mt-2">
            <Button variant="outline" className="gap-2" aria-label={t("common.download")}>
              <Download className="h-4 w-4" aria-hidden="true" />
              {t("common.download")}
            </Button>
            <Button variant="outline" className="gap-2" onClick={openFilters} aria-label={t("notif.filter")}>
              <Filter className="h-4 w-4" aria-hidden="true" />
              {t("notif.filter")}
              {milestoneFilters.size > 0 && (
                <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                  {milestoneFilters.size}
                </Badge>
              )}
            </Button>
          </div>

          {/* Feed list */}
          <TabsContent value="activity" className="mt-0">
            <NotificationList items={paged} onSelect={setSelectedNotification} t={t} />
          </TabsContent>
          <TabsContent value="recognition" className="mt-0">
            <NotificationList items={paged} onSelect={setSelectedNotification} t={t} />
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="ghost" size="icon"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            aria-label={t("notif.prevPage")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums">
            {rangeStart}-{rangeEnd} {t("notif.of")} {totalItems}
          </span>
          <Button
            variant="ghost" size="icon"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            aria-label={t("notif.nextPage")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* ── Detail Sheet ── */}
      <Sheet open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          {selectedNotification && (
            <div className="space-y-6">
              {/* Agent header (recognition only) */}
              {selectedNotification.agentName && (
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                      {selectedNotification.agentName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedNotification.agentName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("notif.agentId")}:{selectedNotification.agentId}
                    </p>
                    {selectedNotification.agentLevel != null && (
                      <p className="text-sm text-muted-foreground">
                        {t("notif.level")}: {selectedNotification.agentLevel}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Contact buttons */}
              {selectedNotification.agentPhone && (
                <div className="space-y-2">
                  <h4 className="font-semibold">{t("notif.contact")}</h4>
                  <a
                    href={`tel:${selectedNotification.agentPhone}`}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground py-3 font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {selectedNotification.agentPhone}
                  </a>
                  <a
                    href={`mailto:${selectedNotification.agentEmail}`}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground py-3 font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {selectedNotification.agentEmail}
                  </a>
                </div>
              )}

              {/* Message */}
              <div>
                <p className="text-sm">{selectedNotification.message}</p>
                {selectedNotification.giftLink && (
                  <a href="#" className="text-sm text-primary underline hover:text-primary/80 mt-1 inline-block">
                    {t("notif.sendGift")}
                  </a>
                )}
              </div>

              {/* Capping details */}
              {selectedNotification.salesPrice != null && (
                <div className="space-y-3">
                  <h4 className="font-semibold">{t("notif.cappingDetails")}</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{t("notif.salesPrice")}</p>
                      <p className="font-medium tabular-nums font-secondary">{formatCurrency(selectedNotification.salesPrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("notif.capReachedDate")}</p>
                      <p className="font-medium tabular-nums">{selectedNotification.capReachedDate ? formatDate(selectedNotification.capReachedDate) : "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t("notif.transactionNumber")}</p>
                      <p className="font-medium tabular-nums">{selectedNotification.transactionNumber}</p>
                    </div>
                  </div>
                  {selectedNotification.address && (
                    <div>
                      <p className="text-xs text-muted-foreground">{t("notif.address")}</p>
                      <p className="text-sm">{selectedNotification.address}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ── Filter Dialog ── */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("notif.filters")}</DialogTitle>
          </DialogHeader>

          {/* By Date */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{t("notif.byDate")}</h4>
              <Button variant="link" size="sm" className="text-primary p-0 h-auto" onClick={() => setTempDateFilter(null)}>
                {t("notif.clear")}
              </Button>
            </div>
            <RadioGroup value={tempDateFilter ?? ""} onValueChange={(v) => setTempDateFilter(v || null)}>
              {["7", "30", "90", "custom"].map((val) => (
                <div key={val} className="flex items-center gap-2">
                  <RadioGroupItem value={val} id={`date-${val}`} />
                  <Label htmlFor={`date-${val}`} className="cursor-pointer">
                    {val === "custom" ? t("notif.chooseFromCalendar") : `${t("notif.last")} ${val} ${t("notif.days")}`}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {tempDateFilter === "custom" && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{t("notif.startDate")}</Label>
                  <Input type="date" defaultValue="2026-01-01" aria-label={t("notif.startDate")} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{t("notif.endDate")}</Label>
                  <Input type="date" defaultValue="2026-02-05" aria-label={t("notif.endDate")} />
                </div>
              </div>
            )}
          </div>

          {/* By Type & Milestone */}
          <div className="space-y-3">
            <h4 className="font-semibold">{t("notif.byTypeMilestone")}</h4>
            {Object.entries(filterCategories).map(([category, milestones]) => (
              <Collapsible key={category} defaultOpen>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`cat-${category}`}
                    checked={milestones.every((m) => tempMilestoneFilters.has(m))}
                    onCheckedChange={(checked) => {
                      setTempMilestoneFilters((prev) => {
                        const next = new Set(prev);
                        milestones.forEach((m) => checked ? next.add(m) : next.delete(m));
                        return next;
                      });
                    }}
                  />
                  <Label htmlFor={`cat-${category}`} className="cursor-pointer font-medium">
                    {category}
                  </Label>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="pl-6 space-y-2 mt-1">
                  {milestones.map((m) => (
                    <div key={m} className="flex items-center gap-2">
                      <Checkbox
                        id={`ms-${m}`}
                        checked={tempMilestoneFilters.has(m)}
                        onCheckedChange={() => toggleMilestone(m)}
                      />
                      <Label htmlFor={`ms-${m}`} className="cursor-pointer text-sm">
                        {m}
                      </Label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={resetFilters} className="flex-1">
              {t("notif.reset")}
            </Button>
            <Button onClick={applyFilters} className="flex-1">
              {t("notif.apply")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

// ── Sub-component ──

function NotificationList({
  items,
  onSelect,
  t,
}: {
  items: NotificationItem[];
  onSelect: (n: NotificationItem) => void;
  t: (key: string) => string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground py-8 text-center">{t("notif.noResults")}</p>;
  }

  return (
    <div className="divide-y">
      {items.map((n) => (
        <button
          key={n.id}
          className="flex items-start justify-between gap-4 py-4 w-full text-start hover:bg-muted/30 transition-colors rounded-lg px-2 -mx-2 min-h-[56px]"
          onClick={() => onSelect(n)}
          aria-label={`${n.message} — ${n.timestamp}`}
        >
          <div className="flex-1 space-y-1 min-w-0">
            <p className="text-sm">{n.message}</p>
            {n.giftLink && (
              <span className="text-sm text-primary underline">{t("notif.sendGift")}</span>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {n.type}
              </Badge>
              <span className="text-xs text-muted-foreground tabular-nums">{n.timestamp}</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground mt-1 shrink-0" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
