import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, DollarSign, Building2 } from "lucide-react";
import { cappingData } from "@/data/mockData";
import { useDashboard } from "@/contexts/DashboardContext";

import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: "blue" | "green" | "purple";
  isLoading?: boolean;
}

function StatCard({ icon, value, label, color, isLoading }: StatCardProps) {
  const colorClasses = {
    blue: { bg: "bg-exp-blue/10", icon: "text-exp-blue" },
    green: { bg: "bg-exp-green/10", icon: "text-exp-green" },
    purple: { bg: "bg-exp-navy/10", icon: "text-exp-navy" },
  };
  const colors = colorClasses[color];

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className={`rounded-full p-2.5 ${colors.bg}`}>
            <div className={colors.icon}>{icon}</div>
          </div>
          <div className="h-8 flex items-center">
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <span className="text-stat-value font-bold text-foreground">{value}</span>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

export function StatsRow() {
  const { isRefreshing } = useDashboard();
  const { formatCurrency } = useFormatters();
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        icon={<Home className="h-5 w-5" />}
        value={cappingData.units.toString()}
        label={t("dashboard.unitsClosed")}
        color="blue"
        isLoading={isRefreshing}
      />
      <StatCard
        icon={<DollarSign className="h-5 w-5" />}
        value={formatCurrency(cappingData.gci, { compact: true })}
        label={t("dashboard.grossCommission")}
        color="green"
        isLoading={isRefreshing}
      />
      <StatCard
        icon={<Building2 className="h-5 w-5" />}
        value={formatCurrency(cappingData.volume, { compact: true })}
        label={t("dashboard.totalVolume")}
        color="purple"
        isLoading={isRefreshing}
      />
    </div>
  );
}
