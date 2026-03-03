import { useState } from "react";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UniversalFilterBar } from "@/components/filters";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  LayoutGrid, 
  List, 
  RefreshCw, 
  Plus, 
  Pin, 
  X, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Clock,
  Sparkles
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip
} from "recharts";

const performanceData = [
  { date: "2022", value: 0 },
  { date: "2023", value: 500 },
  { date: "2024", value: 900 },
  { date: "2025", value: 1400 },
  { date: "2026", value: 1800 },
];

const pinnedInsights = [
  {
    id: "1",
    title: "Agents at Risk",
    description: "3 agents showing signs of disengagement based on activity patterns",
    type: "risk",
    frequency: "daily",
    timestamp: "about 2 hours ago",
    icon: AlertTriangle,
  },
  {
    id: "2",
    title: "6-Month GCI Trend",
    description: "Revenue trending up 12% compared to same period last year",
    type: "trend",
    frequency: "weekly",
    timestamp: "about 5 hours ago",
    icon: TrendingUp,
  },
];

const insightCards = [
  {
    id: "1",
    query: "Who are my agents at risk of leaving or underperforming?",
    title: "At-Risk Agents",
    description: "3 agents flagged based on declining activity, missed targets, or engagement drops.",
    type: "risk",
  },
  {
    id: "2",
    query: "What is my 6-month GCI trend and forecast?",
    title: "6-Month GCI Trend",
    description: "Your gross commission income has grown 12% YoY with projected Q4 acceleration.",
    type: "trend",
  },
];

const quickActions = [
  "What are my key trends?",
  "Show weekly performance summary",
  "Alert me on anomalies",
  "Top performing agents",
  "Revenue forecast",
];

export default function Pulse() {
  useDocumentTitle("Pulse");
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [timePeriod, setTimePeriod] = useState("1Y");
  const [insightFilter, setInsightFilter] = useState("daily");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const typeOptions = [
    { value: "all", label: t("filter.allTypes") },
    { value: "risk", label: "Risk" },
    { value: "trend", label: "Trend" },
  ];

  const priorityOptions = [
    { value: "all", label: t("filter.priority") },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-24">
        {/* Page Header */}
        <UniversalFilterBar title="Pulse" subtitle="Drag to reorder">
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <UniversalFilterBar.Dropdown
            label={t("filter.allTypes")}
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
          />
          <UniversalFilterBar.Dropdown
            label={t("filter.priority")}
            options={priorityOptions}
            value={priorityFilter}
            onChange={setPriorityFilter}
          />
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
          <Button size="sm" className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </UniversalFilterBar>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar: Pinned Insights */}
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">Pinned Insights</CardTitle>
                <Badge variant="secondary" className="rounded-full">
                  {pinnedInsights.length}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tabs */}
              <Tabs value={insightFilter} onValueChange={setInsightFilter}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Pinned Cards */}
              <div className="space-y-3">
                {pinnedInsights
                  .filter((i) => i.frequency === insightFilter)
                  .map((insight) => (
                    <div
                      key={insight.id}
                      className="p-3 rounded-lg border border-border bg-muted/30 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded ${
                            insight.type === "risk" 
                              ? "bg-destructive/10 text-destructive" 
                              : "bg-primary/10 text-primary"
                          }`}>
                            <insight.icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium text-sm">{insight.title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {insight.description}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {insight.timestamp}
                      </p>
                    </div>
                  ))}
                {pinnedInsights.filter((i) => i.frequency === insightFilter).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No {insightFilter} insights pinned
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Content: Performance Overview */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-semibold">Performance Overview</CardTitle>
                <p className="text-sm text-green-600 font-medium mt-1">
                  +40.9% vs period start
                </p>
              </div>
              <Tabs value={timePeriod} onValueChange={setTimePeriod}>
                <TabsList>
                  <TabsTrigger value="1D" className="text-xs px-2">1D</TabsTrigger>
                  <TabsTrigger value="1W" className="text-xs px-2">1W</TabsTrigger>
                  <TabsTrigger value="1M" className="text-xs px-2">1M</TabsTrigger>
                  <TabsTrigger value="1Y" className="text-xs px-2">1Y</TabsTrigger>
                  <TabsTrigger value="ALL" className="text-xs px-2">ALL</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Pin className="h-4 w-4" />
            <span>2 pinned</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>1 daily</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>1 weekly</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>0 manual</span>
          </div>
          <span className="text-primary cursor-pointer hover:underline">
            Drag to reorder
          </span>
        </div>

        {/* Insight Cards Grid */}
        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
          {insightCards.map((card) => (
            <Card key={card.id} className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground italic">"{card.query}"</p>
                <div className="flex items-center gap-2">
                  {card.type === "risk" ? (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-primary" />
                  )}
                  <h3 className="font-semibold">{card.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Action Chips */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Quick actions</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button
                key={action}
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
              >
                {action}
              </Button>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Button variant="link" className="text-primary">
            View All on Pulse
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
