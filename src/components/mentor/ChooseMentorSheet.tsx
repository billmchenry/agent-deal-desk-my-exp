import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, MapPin, Eye } from "lucide-react";
import { mockAvailableMentors, type AvailableMentor } from "@/data/mentorMockData";
import { MentorProfileSheet } from "./MentorProfileSheet";
import { toast } from "sonner";

interface ChooseMentorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMentorChosen: () => void;
}

export function ChooseMentorSheet({ open, onOpenChange, onMentorChosen }: ChooseMentorSheetProps) {
  const [profileMentor, setProfileMentor] = useState<AvailableMentor | null>(null);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="pb-2">
            <SheetTitle className="text-xl">Choose Mentor</SheetTitle>
            <p className="text-sm text-muted-foreground">Select One from Below</p>
          </SheetHeader>

          <div className="space-y-3 mt-4">
            {mockAvailableMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onViewProfile={() => setProfileMentor(mentor)}
                onChoose={onMentorChosen}
              />
            ))}
          </div>

          <button
            className="text-sm text-primary font-medium hover:underline mt-4 block mx-auto"
            onClick={() => toast.info("More mentors will be available soon.")}
          >
            View More
          </button>

          <Separator className="my-6" />

          {/* Choose for Me */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Choose for Me</h4>
            <p className="text-sm text-muted-foreground">
              Can't decide? Let us pair you with a mentor based on your location, market, and experience level.
            </p>
            <Button className="w-full" onClick={onMentorChosen}>
              Choose for Me
            </Button>
          </div>

          <Separator className="my-6" />

          {/* Need Help */}
          <div className="space-y-3 pb-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4" />
              Need Help?
            </h4>
            <p className="text-sm text-muted-foreground">
              Having trouble choosing a mentor or have questions about the program? Our support team is here to help.
            </p>
            <Button variant="outline" className="w-full" onClick={() => toast.info("Our support team will assist you shortly.")}>
              Contact Support
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <MentorProfileSheet
        mentor={profileMentor}
        open={!!profileMentor}
        onOpenChange={(o) => { if (!o) setProfileMentor(null); }}
        onChoose={onMentorChosen}
      />
    </>
  );
}

function MentorCard({
  mentor,
  onViewProfile,
  onChoose,
}: {
  mentor: AvailableMentor;
  onViewProfile: () => void;
  onChoose: () => void;
}) {
  const initials = mentor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Avatar className="h-11 w-11">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{mentor.name}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {mentor.location}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {mentor.badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="text-[10px] px-1.5 py-0">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onViewProfile}>
          <Eye className="h-3.5 w-3.5 mr-1" />
          View Profile
        </Button>
        <Button size="sm" className="flex-1" onClick={onChoose}>
          Choose Mentor
        </Button>
      </div>
    </div>
  );
}
