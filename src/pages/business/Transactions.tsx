import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UniversalFilterBar } from "@/components/filters";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Clock, CheckCircle2, DollarSign, XCircle } from "lucide-react";

type Period = "monthly" | "quarterly" | "yearly";

const PIPELINE_BY_PERIOD: Record<Period, { total: number; inProgress: number; closed: number; paid: number; canceled: number }> = {
  monthly:   { total: 3, inProgress: 1, closed: 1, paid: 1, canceled: 0 },
  quarterly: { total: 8, inProgress: 1, closed: 1, paid: 1, canceled: 0 },
  yearly:    { total: 22, inProgress: 4, closed: 9, paid: 8, canceled: 1 },
};

export default function BusinessTransactions() {
  const { t } = useTranslation();
  const { formatNumber } = useFormatters();
  useDocumentTitle(t("nav.transactions"));

  const [period, setPeriod] = useState<Period>("quarterly");
  const data = PIPELINE_BY_PERIOD[period];

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-20">
        <UniversalFilterBar title={t("nav.transactions")} />

        {/* Active Pipeline Hero */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-exp-dark-navy via-exp-charcoal-blue to-exp-slate-blue p-4 sm:p-6 text-white">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
            <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-exp-frosted-blue" />
            <div className="absolute right-20 bottom-4 h-20 w-20 rounded-full bg-white" />
          </div>

          <div className="relative z-10">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/20">
                <Briefcase className="me-1 h-3 w-3" />
                {t("transactions.activePipeline").toUpperCase()}
              </Badge>
              <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
                <TabsList className="h-10 bg-white/10 border border-white/15 p-1">
                  <TabsTrigger value="monthly" className="rounded-[51px] px-3 py-1.5 text-xs data-[state=active]:bg-white data-[state=active]:text-exp-dark-navy text-white/80">
                    {t("transactions.monthly")}
                  </TabsTrigger>
                  <TabsTrigger value="quarterly" className="rounded-[51px] px-3 py-1.5 text-xs data-[state=active]:bg-white data-[state=active]:text-exp-dark-navy text-white/80">
                    {t("transactions.quarterly")}
                  </TabsTrigger>
                  <TabsTrigger value="yearly" className="rounded-[51px] px-3 py-1.5 text-xs data-[state=active]:bg-white data-[state=active]:text-exp-dark-navy text-white/80">
                    {t("transactions.yearly")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* Total Deals */}
              <div className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3.5 min-w-0 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-md p-1.5 shrink-0 bg-white/15 text-white">
                    <Briefcase className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-white">{t("transactions.totalDeals")}</span>
                </div>
                <p className="text-stat-value font-bold font-secondary text-white leading-none">
                  {formatNumber(data.total)}
                </p>
              </div>

              {/* In Progress */}
              <div className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3.5 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-md p-1.5 shrink-0 bg-exp-gold/20 text-exp-gold-light">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-white">{t("transactions.inProgress")}</span>
                </div>
                <p className="text-stat-value font-bold font-secondary text-exp-gold-light leading-none">
                  {formatNumber(data.inProgress)}
                </p>
              </div>

              {/* Closed */}
              <div className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3.5 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-md p-1.5 shrink-0 bg-exp-green/20 text-exp-green-light">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-white">{t("transactions.closed")}</span>
                </div>
                <p className="text-stat-value font-bold font-secondary text-exp-green-light leading-none">
                  {formatNumber(data.closed)}
                </p>
              </div>

              {/* Paid */}
              <div className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3.5 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-md p-1.5 shrink-0 bg-exp-frosted-blue/30 text-white">
                    <DollarSign className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-white">{t("transactions.paid")}</span>
                </div>
                <p className="text-stat-value font-bold font-secondary text-white leading-none">
                  {formatNumber(data.paid)}
                </p>
              </div>

              {/* Canceled */}
              <div className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-3.5 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-md p-1.5 shrink-0 bg-white/10 text-white/70">
                    <XCircle className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-white">{t("transactions.canceled")}</span>
                </div>
                <p className="text-stat-value font-bold font-secondary text-white/70 leading-none">
                  {formatNumber(data.canceled)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-dashed border-border bg-card text-sm text-muted-foreground">
          {t("transactions.placeholder")}
        </div>
      </div>
    </DashboardLayout>
  );
}
