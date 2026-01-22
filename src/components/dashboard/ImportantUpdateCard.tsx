import { Play, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ImportantUpdateCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold">Important Update</CardTitle>
          <Badge variant="destructive" className="text-xs">
            NEW
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Video Thumbnail */}
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
      </CardContent>
    </Card>
  );
}
