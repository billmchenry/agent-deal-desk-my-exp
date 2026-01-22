import { GraduationCap, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UniversityCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-exp-blue" />
          <CardTitle className="text-lg font-semibold">eXp University</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Access world-class training and resources to grow your real estate career.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="justify-start gap-2 h-auto py-3" asChild>
            <a href="#">
              <ExternalLink className="h-4 w-4" />
              <span className="text-sm">Browse Courses</span>
            </a>
          </Button>
          <Button variant="outline" className="justify-start gap-2 h-auto py-3" asChild>
            <a href="#">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">eXpU Calendar</span>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
