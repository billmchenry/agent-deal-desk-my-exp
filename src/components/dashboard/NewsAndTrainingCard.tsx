import { Play, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export function NewsAndTrainingCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">News & Training</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="updates">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="updates" className="flex-1">Updates</TabsTrigger>
            <TabsTrigger value="training" className="flex-1">Training</TabsTrigger>
          </TabsList>
          
          <TabsContent value="updates" className="space-y-3 mt-0">
            {/* Video Thumbnail */}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="destructive" className="text-xs">NEW</Badge>
            </div>
            <div className="relative rounded-lg overflow-hidden bg-exp-navy aspect-video group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-white">
                  <Sparkles className="h-8 w-8 text-exp-gold" />
                  <span className="font-semibold">Lineage View</span>
                  <span className="text-sm text-white/70">New Feature Announcement</span>
                </div>
              </div>
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-full bg-white/90 hover:bg-white text-exp-navy"
                >
                  <Play className="h-6 w-6 ml-1" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Discover the new Lineage View feature that helps you visualize your network and track your team's growth.
            </p>
          </TabsContent>
          
          <TabsContent value="training" className="space-y-3 mt-0">
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
