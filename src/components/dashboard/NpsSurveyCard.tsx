import { useState } from "react";
import { MessageCircleQuestion, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NpsSurveyModal } from "./NpsSurveyModal";

export function NpsSurveyCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="border">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MessageCircleQuestion className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold mb-1">Your Feedback is Important</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Fill out the agent eXp NPS survey today!
              </p>
              <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
                Take Survey
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <NpsSurveyModal open={open} onOpenChange={setOpen} />
    </>
  );
}
