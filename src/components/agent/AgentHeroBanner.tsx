import { useNavigate } from "react-router-dom";
import { Home, DollarSign, Building2, Target, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";

interface AgentHeroBannerProps {
  units: number;
  volume: number;
  commission: number;
  transactionsClosed: number;
  transactionsPending: number;
  transactionsWithdrawn: number;
  transactionsFirm?: number;
  hideStatusBreakdown?: boolean;
}

function MiniStatCard({
  icon,
  value,
  label,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: "blue" | "green" | "gold" | "purple";
  onClick?: () => void;
}) {
  const colorClasses = {
    blue: "bg-exp-slate-blue/15 text-exp-slate-blue",
    green: "bg-exp-green/15 text-exp-green",
    gold: "bg-exp-gold/15 text-exp-gold",
    purple: "bg-exp-slate-blue/15 text-exp-slate-blue",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg border border-exp-slate-blue/20 bg-exp-charcoal-blue/5 dark:bg-white/5 dark:border-white/15 backdrop-blur-sm px-3 py-2.5 min-w-0 cursor-pointer hover:bg-exp-charcoal-blue/10 dark:hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-ring text-left w-full"
      role="link"
      aria-label={`${label}: ${value}. View details`}
    >
      <div className={cn("rounded-full p-2 shrink-0", colorClasses[color])}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-section-title font-bold text-exp-dark-navy dark:text-white truncate">{value}</p>
        <p className="text-xs sm:text-[11px] text-exp-moss-grey dark:text-white/60">{label}</p>
      </div>
    </button>
  );
}

export function AgentHeroBanner({
  units,
  volume,
  commission,
  transactionsClosed,
  transactionsPending,
  transactionsWithdrawn,
  transactionsFirm,
  hideStatusBreakdown,
}: AgentHeroBannerProps) {
  const { formatCurrency } = useFormatters();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goToTransactions = (status?: string) => {
    const url = status ? `/agent/transactions?status=${status}` : "/agent/transactions";
    navigate(url);
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-exp-frosted-blue via-exp-light-grey to-exp-frosted-blue dark:from-exp-dark-navy dark:via-exp-charcoal-blue dark:to-exp-dark-navy p-4 sm:p-6">
      {/* Decorative background */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
        <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-exp-slate-blue" />
        <div className="absolute right-20 bottom-4 h-20 w-20 rounded-full bg-exp-moss-grey" />
      </div>

      <div className="relative z-10">
        {/* Header Row */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-exp-charcoal-blue/10 text-exp-charcoal-blue border-exp-charcoal-blue/20 hover:bg-exp-charcoal-blue/15 dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/15">
              <Target className="me-1 h-3 w-3" />
              PERFORMANCE
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <MiniStatCard
            icon={<Home className="h-4 w-4" />}
            value={units.toString()}
            label={t("agent.units")}
            color="blue"
            onClick={() => goToTransactions()}
          />
          <MiniStatCard
            icon={<Building2 className="h-4 w-4" />}
            value={formatCurrency(volume, { compact: true })}
            label={t("agent.volume")}
            color="purple"
            onClick={() => goToTransactions()}
          />
          <MiniStatCard
            icon={<DollarSign className="h-4 w-4" />}
            value={formatCurrency(commission, { compact: true })}
            label={t("agent.commission")}
            color="green"
            onClick={() => goToTransactions()}
          />
          {hideStatusBreakdown ? (
            <MiniStatCard
              icon={<FileText className="h-4 w-4" />}
              value={transactionsClosed.toString()}
              label={t("agent.transactionsClosed")}
              color="gold"
              onClick={() => goToTransactions("paid")}
            />
          ) : (
            <div
              className="flex items-center gap-2 rounded-lg border border-exp-slate-blue/20 bg-exp-charcoal-blue/5 dark:bg-white/5 dark:border-white/15 backdrop-blur-sm px-3 py-2.5 min-w-0 cursor-pointer hover:bg-exp-charcoal-blue/10 dark:hover:bg-white/10 transition-colors"
              role="link"
              aria-label="View transaction details"
            >
              <div className="hidden sm:flex rounded-full p-2 shrink-0 bg-exp-gold/15 text-exp-gold">
                <FileText className="h-4 w-4" />
              </div>
               <div className="flex gap-2 sm:gap-3 min-w-0">
                <button
                  type="button"
                  className="text-center focus-visible:ring-2 focus-visible:ring-ring rounded px-1 min-h-[44px] flex flex-col items-center justify-center"
                  onClick={() => goToTransactions("paid")}
                >
                  <p className="text-section-title font-bold text-exp-dark-navy">{transactionsClosed}</p>
                  <p className="text-xs sm:text-[11px] text-exp-moss-grey">{t("txn.paid")}</p>
                </button>
                {transactionsFirm !== undefined && (
                  <button
                    type="button"
                    className="text-center focus-visible:ring-2 focus-visible:ring-ring rounded px-1 min-h-[44px] flex flex-col items-center justify-center"
                    onClick={() => goToTransactions("firm")}
                  >
                    <p className="text-section-title font-bold text-exp-dark-navy">{transactionsFirm}</p>
                    <p className="text-xs sm:text-[11px] text-exp-moss-grey">{t("txn.firm")}</p>
                  </button>
                )}
                <button
                  type="button"
                  className="text-center focus-visible:ring-2 focus-visible:ring-ring rounded px-1 min-h-[44px] flex flex-col items-center justify-center"
                  onClick={() => goToTransactions("pending")}
                >
                  <p className="text-section-title font-bold text-exp-dark-navy">{transactionsPending}</p>
                  <p className="text-xs sm:text-[11px] text-exp-moss-grey">{t("txn.pending")}</p>
                </button>
                <button
                  type="button"
                  className="text-center focus-visible:ring-2 focus-visible:ring-ring rounded px-1 min-h-[44px] flex flex-col items-center justify-center"
                  onClick={() => goToTransactions("withdrawn")}
                >
                  <p className="text-section-title font-bold text-exp-dark-navy">{transactionsWithdrawn}</p>
                  <p className="text-xs sm:text-[11px] text-exp-moss-grey">{t("txn.withdrawn")}</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
