import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Facebook, Linkedin, ExternalLink } from "lucide-react";

interface MyMentorProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for the logged-in mentor's own profile
const myMentorProfile = {
  name: "Alejandra J Pino Torrealba",
  location: "Pembroke Pines, FL",
  avatarUrl: "",
  bio: "Real Estate Agent for Exp Realty.\nWorking with First time Buyers in South Florida.\nPromoting New Constructions.",
  locationsServiced: ["Pembroke Pines, Florida", "Miami Lakes, Florida", "Miramar, Florida"],
  licenses: ["FL"],
  languages: ["English", "Spanish"],
  mls: ["SEF Shared MLS Database"],
  specializations: [],
  certifications: [],
  phone: "(754) 209-3117",
  email: "alejandra.pino-torrealba@exprealty.com",
  facebook: "https://facebook.com",
  linkedin: "https://linkedin.com",
  website: "",
};

export function MyMentorProfileSheet({ open, onOpenChange }: MyMentorProfileSheetProps) {
  const p = myMentorProfile;
  const initials = p.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-0">
          <div className="flex items-start gap-4 pb-4">
            <Avatar className="h-16 w-16 border-2 border-border">
              <AvatarImage src={p.avatarUrl} alt={p.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="pt-1">
              <SheetTitle className="text-lg text-left">{p.name}</SheetTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5" />
                {p.location}
              </p>
            </div>
          </div>
        </SheetHeader>

        {/* Bio */}
        <div className="py-4">
          {p.bio.split("\n").map((line, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">{line}</p>
          ))}
        </div>

        <Separator />

        {/* Details Grid */}
        <div className="py-4 grid grid-cols-2 gap-x-6 gap-y-5">
          <DetailSection title="Locations Serviced" items={p.locationsServiced} />
          <DetailSection title="Licenses" items={p.licenses} />
          <DetailSection title="Languages" items={p.languages} />
          <DetailSection title="MLS" items={p.mls} />
          <DetailSection title="Specializations" items={p.specializations} />
          <DetailSection title="Certifications/Designations" items={p.certifications} />
        </div>

        <Separator />

        {/* Contact */}
        <div className="py-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">Contact</p>
          <Button variant="default" className="w-full justify-start gap-2" asChild>
            <a href={`tel:${p.phone}`}>
              <Phone className="h-4 w-4" />
              {p.phone}
            </a>
          </Button>
          <Button variant="default" className="w-full justify-start gap-2" asChild>
            <a href={`mailto:${p.email}`}>
              <Mail className="h-4 w-4" />
              {p.email}
            </a>
          </Button>
          <div className="flex gap-2">
            {p.facebook && (
              <Button variant="outline" size="sm" className="gap-1.5" asChild>
                <a href={p.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-3.5 w-3.5" />
                  Facebook
                </a>
              </Button>
            )}
            {p.linkedin && (
              <Button variant="outline" size="sm" className="gap-1.5" asChild>
                <a href={p.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-3.5 w-3.5" />
                  LinkedIn
                </a>
              </Button>
            )}
          </div>
        </div>

        <Separator />

        <div className="py-4">
          <Button variant="destructive" className="w-full gap-2">
            <ExternalLink className="h-4 w-4" />
            Update profile details in Agent Directory
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function DetailSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold text-foreground mb-1">{title}</p>
      {items.length > 0 ? (
        <ul className="space-y-0.5">
          {items.map((item) => (
            <li key={item} className="text-sm text-muted-foreground">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">—</p>
      )}
    </div>
  );
}
