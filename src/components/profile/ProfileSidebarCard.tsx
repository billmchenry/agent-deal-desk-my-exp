import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { currentUser, userProfile } from "@/data/mockData";

export function ProfileSidebarCard() {
  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card className="w-full lg:w-80 shrink-0">
      <CardContent className="p-6">
        {/* Avatar with online indicator */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="bg-exp-blue text-primary-foreground text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-exp-green border-2 border-background" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            {currentUser.name}
          </h2>
          <p className="text-sm text-muted-foreground">{currentUser.role}</p>
        </div>

        {/* Agent IDs */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Agent ID</span>
            <span className="text-sm font-medium text-foreground">
              {userProfile.agentId}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">NRDS ID</span>
            <span className="text-sm font-medium text-foreground">
              {userProfile.nrdsId}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">DepositLink ID</span>
            <span className="text-sm font-medium text-foreground">
              {userProfile.depositLinkId}
            </span>
          </div>
        </div>

        {/* Agent Flags */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Agent Flags</h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.flags.map((flag) => (
              <Badge
                key={flag}
                variant="secondary"
                className="bg-exp-blue/10 text-exp-blue hover:bg-exp-blue/20"
              >
                {flag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
