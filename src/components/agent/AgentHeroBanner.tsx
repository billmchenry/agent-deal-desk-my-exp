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
  colorClass,
  onClick,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  colorClass: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3.5 min-w-0 cursor-pointer hover:bg-white/15 transition-colors focus-visible:ring-2 focus-visible:ring-ring text-left w-full"
      role="link"
      aria-label={`${label}: ${value}. View details`}
    >
      <div className={cn("rounded-full p-2.5 shrink-0", colorClass)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl sm:text-section-title font-bold text-white truncate">{value}</p>
        <p className="text-xs text-white/60">{label}</p>
      </div>
    </button>
  );
}

function StatusDot({ color }: { color: "green" | "yellow" | "red" }) {
  const dotColors = {
    green: "bg-exp-green",
    yellow: "bg-exp-gold",
    red: "bg-exp-red",
  };
  return <span className={cn("inline-block w-2 h-2 rounded-full", dotColors[color])} />;
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
    <Card className="relative overflow-hidden bg-gradient-to-r from-exp-dark-navy via-exp-charcoal-blue to-exp-slate-blue text-white p-5 sm:p-6">
      {/* Decorative background */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
        <div className="absolute right-8 top-8 h-32 w-32 rounded-full bg-exp-frosted-blue" />
        <div className="absolute right-20 bottom-4 h-20 w-20 rounded-full bg-white" />
      </div>

      <div className="relative z-10">
        {/* Header Row */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/20">
              <Target className="me-1 h-3 w-3" />
              PERFORMANCE
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <MiniStatCard
            icon={<Home className="h-6 w-6" />}
            value={units.toString()}
            label={t("agent.units")}
            colorClass="bg-exp-blue/25 text-white"
            onClick={() => goToTransactions()}
          />
          <MiniStatCard
            icon={<Building2 className="h-6 w-6" />}
            value={formatCurrency(volume, { compact: true })}
            label={t("agent.volume")}
            colorClass="bg-exp-purple/25 text-white"
            onClick={() => goToTransactions()}
          />
          <MiniStatCard
            icon={<DollarSign className="h-6 w-6" />}
            value={formatCurrency(commission, { compact: true })}
            label={t("agent.commission")}
            colorClass="bg-exp-green/25 text-white"
            onClick={() => goToTransactions()}
          />
          {hideStatusBreakdown ? (
            <MiniStatCard
              icon={<FileText className="h-6 w-6" />}
              value={transactionsClosed.toString()}
              label={t("agent.transactionsClosed")}
              colorClass="bg-exp-gold/25 text-white"
              onClick={() => goToTransactions("paid")}
            />
          ) : (
            <div
              className="rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3.5 min-w-0 cursor-pointer hover:bg-white/15 transition-colors"
              role="link"
              aria-label="View transaction details"
            >
              <div className="grid grid-cols-3 gap-0 min-w-0 relative">
                {/* Paid */}
                <button
                  type="button"
                  className="text-center focus-visible:ring-2 focus-visible:ring-ring rounded px-1 min-h-[44px] flex flex-col items-center justify-center"
                  onClick={() => goToTransactions("paid")}
                >
                  <p className="text-2xl sm:text-section-title font-bold text-white">{transactionsClosed}</p>
                  <p className="text-xs text-white/60 flex items-center gap-1">
                    <StatusDot color="green" />
                    {t("txn.paid")}
                  </p>
                </button>

                {/* Divider */}
                <div className="absolute left-1/3 top-2 bottom-2 w-px bg-white/20" />

                {/* Pending / Firm */}
                {transactionsFirm !== undefined ? (
                  <button
                    type="button"
                    className="text-center focus-visible:ring-2 focus-visible:ring-ring rounded px-1 min-h-[44px] flex flex-col items-center justify-center"
                    onClick={() => goToTransactions("firm")}
                  >
                    <p className="text-2xl sm:text-section-title font-bold text-white">{transactionsFirm}</p>
                    <p className="text-xs text-white/60 flex items-center gap-1">
                      <StatusDot color="yellow" />
                      {t("txn.firm")}
                    </p>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="text-center focus-visible:ring-2 focus-visible:ring-ring rounded px-1 min-h-[44px] flex flex-col items-center justify-center"
                    onClick={() => goToTransactions("pending")}
                  >
                    <p className="text-2xl sm:text-section-title font-bold text-white">{transactionsPending}</p>
                    <p className="text-xs text-white/60 flex items-center gap-1">
                      <StatusDot color="yellow" />
                      {t("txn.pending")}
                    </p>
                  </button>
                )}

                {/* Divider */}
                <div className="absolute left-2/3 top-2 bottom-2 w-px bg-white/20" />

                {/* Withdrawn */}
                <button
                  type="button"
                  className="text-center focus-visible:ring-2 focus-visible:ring-ring rounded px-1 min-h-[44px] flex flex-col items-center justify-center"
                  onClick={() => goToTransactions("withdrawn")}
                >
                  <p className="text-2xl sm:text-section-title font-bold text-white">{transactionsWithdrawn}</p>
                  <p className="text-xs text-white/60 flex items-center gap-1">
                    <StatusDot color="red" />
                    {t("txn.withdrawn")}
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
