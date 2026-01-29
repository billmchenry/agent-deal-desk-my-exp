import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus, Video } from "lucide-react";

const appointments = [
  {
    id: 1,
    title: "Team Huddle",
    type: "meeting",
    time: "2:00 PM",
    date: "Today",
    isVideo: true,
  },
  {
    id: 2,
    title: "Client Showing - 123 Oak St",
    type: "showing",
    time: "4:30 PM",
    date: "Today",
    isVideo: false,
  },
  {
    id: 3,
    title: "Training: Negotiation Skills",
    type: "training",
    time: "10:00 AM",
    date: "Tomorrow",
    isVideo: true,
  },
];

export function AppointmentsCard() {
  const getTypeBadge = (type: string) => {
    const styles = {
      meeting: "bg-exp-blue/10 text-exp-blue border-exp-blue/20",
      showing: "bg-exp-green/10 text-exp-green border-exp-green/20",
      training: "bg-exp-purple/10 text-exp-purple border-exp-purple/20",
    };
    return styles[type as keyof typeof styles] || styles.meeting;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Upcoming</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-exp-blue/10">
              <Calendar className="h-5 w-5 text-exp-blue" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{apt.title}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{apt.time}</span>
                <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${getTypeBadge(apt.type)}`}>
                  {apt.date}
                </Badge>
              </div>
            </div>
            {apt.isVideo && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-exp-green/10">
                <Video className="h-4 w-4 text-exp-green" />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
