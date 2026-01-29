import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const trainingEvents = [
  {
    id: 1,
    title: "Annual DISC Your Brand Online",
    subtitle: "Weekly Team Huddle - 2 PM",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face",
    initials: "DY",
  },
  {
    id: 2,
    title: "Annual Conference with 'Building Your 2026 Date Announced!'",
    subtitle: "",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face",
    initials: "AC",
  },
  {
    id: 3,
    title: "Annual Partnership with",
    subtitle: "'Building Your Huddle - Calendar'",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    initials: "AP",
    date: "29",
  },
];

export function TrainingEducationCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Training & Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trainingEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
          >
            <Avatar className="h-10 w-10 rounded-lg">
              <AvatarImage src={event.avatar} alt={event.title} className="object-cover" />
              <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
                {event.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{event.title}</p>
              {event.subtitle && (
                <p className="text-xs text-muted-foreground">{event.subtitle}</p>
              )}
            </div>
            {event.date && (
              <Badge variant="secondary" className="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold">
                {event.date}
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
