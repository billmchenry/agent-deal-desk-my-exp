import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, MapPin, Globe, Facebook, Linkedin, ChevronLeft } from "lucide-react";
import type { AvailableMentor } from "@/data/mentorMockData";

interface MentorProfileSheetProps {
  mentor: AvailableMentor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChoose: () => void;
}

export function MentorProfileSheet({ mentor, open, onOpenChange, onChoose }: MentorProfileSheetProps) {
  const [bioExpanded, setBioExpanded] = useState(true);

  if (!mentor) return null;

  const initials = mentor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const bioPreview = mentor.bio.length > 180 ? mentor.bio.slice(0, 180) + "…" : mentor.bio;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-0">
          <button
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors -ml-1 mb-2"
            onClick={() => onOpenChange(false)}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>
          <div className="flex flex-col items-center gap-3 pb-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <SheetTitle className="text-lg">{mentor.name}</SheetTitle>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {mentor.location}
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                {mentor.badges.map((badge) => (
                  <Badge key={badge} variant="secondary" className="text-[10px] px-2 py-0.5">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </SheetHeader>

        <Separator />

        {/* Bio */}
        <div className="py-4">
          <h4 className="text-sm font-semibold text-foreground mb-2">About</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {bioExpanded ? mentor.bio : bioPreview}
          </p>
          {mentor.bio.length > 180 && (
            <button
              className="text-xs text-primary font-medium hover:underline mt-1"
              onClick={() => setBioExpanded(!bioExpanded)}
            >
              {bioExpanded ? "View Less" : "View More"}
            </button>
          )}
        </div>

        <Separator />

        {/* Details Grid */}
        <div className="py-4 grid grid-cols-2 gap-4">
          <DetailSection title="Locations Serviced" items={mentor.locationsServiced} />
          <DetailSection title="Licenses" items={mentor.licenses.map((l) => `${l.state} — ${l.number}`)} />
          <DetailSection title="Languages" items={mentor.languages} />
          <DetailSection title="MLS" items={mentor.mls} />
          <DetailSection title="Specializations" items={mentor.specializations} />
          <DetailSection title="Certifications" items={mentor.certifications} />
        </div>

        <Separator />

        {/* Contact */}
        <div className="py-4 space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Contact</h4>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" asChild>
              <a href={`tel:${mentor.phone}`}>
                <Phone className="h-4 w-4 mr-1.5" />
                Call
              </a>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a href={`mailto:${mentor.email}`}>
                <Mail className="h-4 w-4 mr-1.5" />
                Email
              </a>
            </Button>
          </div>
          {(mentor.facebook || mentor.linkedin || mentor.website) && (
            <div className="flex gap-2">
              {mentor.facebook && (
                <Button variant="ghost" size="icon" asChild>
                  <a href={mentor.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {mentor.linkedin && (
                <Button variant="ghost" size="icon" asChild>
                  <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {mentor.website && (
                <Button variant="ghost" size="icon" asChild>
                  <a href={mentor.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Footer Actions */}
        <div className="flex gap-3 py-4">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Back
          </Button>
          <Button className="flex-1" onClick={onChoose}>
            Choose Mentor
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-foreground mb-1">{title}</p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item} className="text-xs text-muted-foreground">{item}</li>
        ))}
      </ul>
    </div>
  );
}
