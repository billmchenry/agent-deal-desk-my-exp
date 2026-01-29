import { MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const sponsor = {
  name: "Ian Marshall",
  role: "Sponsor",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
};

const reapMembers = [
  {
    id: 1,
    name: "eXP Reap 5",
    role: "eXPU/Influencer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Michael Brooks",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
  },
];

export function ConnectUplineCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Connect with your Upline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sponsor Section */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <Avatar className="h-12 w-12">
            <AvatarImage src={sponsor.avatar} alt={sponsor.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {sponsor.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{sponsor.role}:</p>
            <p className="font-medium">{sponsor.name}</p>
          </div>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Message
          </Button>
        </div>

        {/* Reap Members */}
        <div className="space-y-2">
          {reapMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3 py-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{member.name}</p>
                {member.role && (
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
