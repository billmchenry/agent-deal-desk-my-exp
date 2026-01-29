import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";

const progressItems = [
  {
    id: 1,
    title: "Complete ICON Application",
    status: "done",
    tag: "ICON",
    tagColor: "gold",
  },
  {
    id: 2,
    title: "Submit Q1 Quarterly Review",
    status: "pending",
    tag: "Required",
    tagColor: "red",
  },
  {
    id: 3,
    title: "Attend Annual Conference",
    status: "upcoming",
    tag: "Event",
    tagColor: "blue",
  },
  {
    id: 4,
    title: "Update License Renewal",
    status: "warning",
    tag: "Due Soon",
    tagColor: "gold",
  },
];

export function ProgressReportCard() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-5 w-5 text-exp-green" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-exp-gold" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getTagStyle = (color: string) => {
    const styles = {
      gold: "bg-exp-gold/10 text-exp-gold border-exp-gold/20",
      red: "bg-exp-red/10 text-exp-red border-exp-red/20",
      blue: "bg-exp-blue/10 text-exp-blue border-exp-blue/20",
      green: "bg-exp-green/10 text-exp-green border-exp-green/20",
    };
    return styles[color as keyof typeof styles] || styles.blue;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Progress Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {progressItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/50 ${
              item.status === "done" ? "opacity-60" : ""
            }`}
          >
            {getStatusIcon(item.status)}
            <div className="min-w-0 flex-1">
              <p className={`text-sm ${item.status === "done" ? "line-through" : "font-medium"}`}>
                {item.title}
              </p>
            </div>
            <Badge 
              variant="secondary" 
              className={`text-[10px] px-1.5 py-0 shrink-0 ${getTagStyle(item.tagColor)}`}
            >
              {item.tag}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
