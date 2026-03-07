import { useState } from "react";
import { Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uplinePartners } from "@/data/mockData";

export function UplinePartnersCard() {
  const [view, setView] = useState<"lineage" | "contributor">("lineage");

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  const displayedPartners =
    view === "contributor"
      ? uplinePartners.filter((p) => p.isContributor)
      : uplinePartners;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-section-title font-semibold">Upline Partners</CardTitle>
          <Tabs value={view} onValueChange={(v) => setView(v as "lineage" | "contributor")}>
            <TabsList className="h-8">
              <TabsTrigger value="lineage" className="text-xs px-3">
                Lineage
              </TabsTrigger>
              <TabsTrigger value="contributor" className="text-xs px-3">
                Contributor View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-1">
          {displayedPartners.map((partner, index) => (
            <div key={partner.id} className="relative flex items-center gap-3 py-2">
              {/* Connector Line */}
              {index < displayedPartners.length - 1 && (
                <div className="absolute left-5 top-12 h-full w-px bg-border" />
              )}
              
              {/* Avatar */}
              <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                <AvatarImage src={partner.avatar} alt={partner.name} />
                <AvatarFallback className="bg-exp-blue text-white text-xs">
                  {getInitials(partner.name)}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{partner.name}</p>
                <p className="text-xs text-muted-foreground">Level {partner.level}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-exp-blue hover:text-exp-blue hover:bg-exp-blue/10"
                  aria-label={`Call ${partner.name}`}
                >
                  <Phone className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-exp-blue hover:text-exp-blue hover:bg-exp-blue/10"
                  aria-label={`Email ${partner.name}`}
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
