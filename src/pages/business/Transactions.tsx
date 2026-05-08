import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UniversalFilterBar } from "@/components/filters";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormatters } from "@/hooks/useFormatters";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type Period = "monthly" | "quarterly" | "yearly";

const PIPELINE_BY_PERIOD: Record<Period, { inProgress: number; closed: number; paid: number; canceled: number }> = {
  monthly:   { inProgress: 1, closed: 1, paid: 1, canceled: 0 },
  quarterly: { inProgress: 1, closed: 1, paid: 1, canceled: 0 },
  yearly:    { inProgress: 4, closed: 9, paid: 8, canceled: 1 },
};

export default function BusinessTransactions() {
  const { t } = useTranslation();
  const { formatNumber } = useFormatters();
  useDocumentTitle(t("nav.transactions"));

  const [period, setPeriod] = useState<Period>("quarterly");
  const d = PIPELINE_BY_PERIOD[period];
  const total = d.inProgress + d.closed + d.paid + d.canceled;

  const segments = [
    { key: "inProgress", label: t("transactions.inProgress"), value: d.inProgress, color: "hsl(var(--exp-purple))" },
    { key: "closed",     label: t("transactions.closed"),     value: d.closed,     color: "hsl(var(--exp-green))" },
    { key: "paid",       label: t("transactions.paid"),       value: d.paid,       color: "hsl(var(--exp-blue-light))" },
    { key: "canceled",   label: t("transactions.canceled"),   value: d.canceled,   color: "hsl(var(--exp-light-grey))" },
  ];

  const chartData = total === 0
    ? [{ key: "empty", value: 1, color: "hsl(var(--muted))" }]
    : segments.filter((s) => s.value > 0);

  return (
    <DashboardLayout>
      <div className="space-y-4 pb-20">
        <UniversalFilterBar title={t("nav.transactions")} />

        {/* Active Pipeline Hero — donut + legend */}
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

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Donut with center total */}
              <div className="relative w-40 h-40 sm:w-44 sm:h-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius="68%"
                      outerRadius="100%"
                      dataKey="value"
                      stroke="none"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {chartData.map((s) => (
                        <Cell key={s.key} fill={s.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="font-secondary font-bold text-4xl sm:text-5xl text-white leading-none tabular-nums">
                    {formatNumber(total)}
                  </p>
                  <p className="text-xs text-white/70 mt-1">{t("transactions.totalDeals")}</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 w-full grid grid-cols-2 gap-3">
                {segments.map((s) => {
                  const pct = total ? Math.round((s.value / total) * 100) : 0;
                  return (
                    <div key={s.key} className="rounded-lg bg-white/10 backdrop-blur-sm px-3 py-2.5 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-xs font-semibold text-white truncate">{s.label}</span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <p className="font-secondary font-bold text-2xl text-white leading-none tabular-nums">
                          {formatNumber(s.value)}
                        </p>
                        <span className="text-xs text-white/60 tabular-nums">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
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
