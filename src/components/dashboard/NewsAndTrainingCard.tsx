import { Play, Sparkles, ExternalLink, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const quickLinks = [
  { label: "eXpU Courses", url: "#" },
  { label: "eXpU YouTube", url: "#" },
  { label: "KGCI Real Estate on Air", url: "#" },
  { label: "Instructor Interest Form", url: "#" },
];

export function NewsAndTrainingCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-section-title font-semibold">News & Training</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="updates">
          <TabsList className="w-full mb-4 bg-muted/60 backdrop-blur-sm border border-border/50 rounded-full h-10 p-1">
            <TabsTrigger value="updates" className="flex-1 rounded-full px-3 py-1.5 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:font-bold">Updates</TabsTrigger>
            <TabsTrigger value="training" className="flex-1 rounded-full px-3 py-1.5 text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:font-bold">Training</TabsTrigger>
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
                  aria-label="Play video"
                >
                  <Play className="h-6 w-6 ml-1" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Discover the new Lineage View feature that helps you visualize your network and track your team's growth.
            </p>
          </TabsContent>
          
          <TabsContent value="training" className="mt-0">
            {/* eXp University Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-section-title font-bold text-foreground">eXp</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-section-title font-semibold text-muted-foreground tracking-wide">UNIVERSITY</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground mb-2">Quick Links</p>
              <div className="grid grid-cols-1 gap-1">
                {quickLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-primary hover:bg-muted/50 hover:underline transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
