import { useState } from "react";
import { Phone, Mail, MessageSquare, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { uplinePartners, UplinePartner } from "@/data/mockData";

export function ConnectUplineCard() {
  const [view, setView] = useState<"lineage" | "contributor">("lineage");
  const [selectedPartner, setSelectedPartner] = useState<UplinePartner | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  const displayedPartners =
    view === "contributor"
      ? uplinePartners.filter((p) => p.isContributor)
      : uplinePartners;

  const handlePartnerClick = (partner: UplinePartner) => {
    setSelectedPartner(partner);
    setSheetOpen(true);
  };

  const getLevelLabel = (level: number) => {
    if (level === 1) return "Level 1 - Sponsor";
    return `Level ${level}`;
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base font-semibold">Connect with your Upline</CardTitle>
            <Tabs value={view} onValueChange={(v) => setView(v as "lineage" | "contributor")}>
              <TabsList className="h-8">
                <TabsTrigger value="lineage" className="text-xs px-3">
                  Lineage
                </TabsTrigger>
                <TabsTrigger value="contributor" className="text-xs px-3">
                  Contributor
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="h-[280px]">
            <div className="space-y-1 pr-4">
              {displayedPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex items-center gap-3 min-h-[56px] py-2 px-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Tappable Avatar + Name */}
                  <button
                    onClick={() => handlePartnerClick(partner)}
                    className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  >
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm flex-shrink-0">
                      <AvatarImage src={partner.avatar} alt={partner.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(partner.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{partner.name}</p>
                      <p className="text-xs text-muted-foreground">{getLevelLabel(partner.level)}</p>
                    </div>
                  </button>

                  {/* Quick Actions */}
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-primary hover:text-primary hover:bg-primary/10"
                      asChild
                    >
                      <a href={`tel:${partner.phone}`} aria-label={`Call ${partner.name}`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-primary hover:text-primary hover:bg-primary/10"
                      asChild
                    >
                      <a href={`mailto:${partner.email}`} aria-label={`Email ${partner.name}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Contact Details Sheet (works on both mobile and desktop) */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader className="text-left pb-4">
            <SheetTitle>Contact Details</SheetTitle>
          </SheetHeader>

          {selectedPartner && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-4 border-background shadow-lg">
                  <AvatarImage src={selectedPartner.avatar} alt={selectedPartner.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {getInitials(selectedPartner.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedPartner.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {getLevelLabel(selectedPartner.level)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-14 justify-start gap-4 text-left"
                  asChild
                >
                  <a href={`tel:${selectedPartner.phone}`}>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm">Call</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {selectedPartner.phone}
                      </p>
                    </div>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-14 justify-start gap-4 text-left"
                  asChild
                >
                  <a href={`mailto:${selectedPartner.email}`}>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm">Email</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {selectedPartner.email}
                      </p>
                    </div>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-14 justify-start gap-4 text-left"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">Message</p>
                    <p className="text-xs text-muted-foreground">Send a message</p>
                  </div>
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
