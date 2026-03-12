import { useState, useRef, useEffect } from "react";
import { ArrowRight, TrendingUp, Play, Target, MessageCircleQuestion } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NpsSurveyModal } from "./NpsSurveyModal";

const themeStyles = {
  purple: {
    card: "bg-gradient-to-r from-exp-purple/10 to-exp-purple/5 border-exp-purple/20",
    icon: "bg-exp-purple/20 text-exp-purple",
    button: "bg-exp-purple hover:bg-exp-purple/90",
  },
  gold: {
    card: "bg-gradient-to-r from-exp-gold/10 to-exp-gold/5 border-exp-gold/20",
    icon: "bg-exp-gold/20 text-exp-gold",
    button: "bg-exp-gold hover:bg-exp-gold/90 text-foreground",
  },
  blue: {
    card: "bg-gradient-to-r from-exp-blue/10 to-exp-blue/5 border-exp-blue/20",
    icon: "bg-exp-blue/20 text-exp-blue",
    button: "bg-exp-blue hover:bg-exp-blue/90 text-white",
  },
  green: {
    card: "bg-gradient-to-r from-exp-green/10 to-exp-green/5 border-exp-green/20",
    icon: "bg-exp-green/20 text-exp-green",
    button: "bg-exp-green hover:bg-exp-green/90 text-white",
  },
  slate: {
    card: "border bg-muted/30",
    icon: "bg-muted text-muted-foreground",
    button: "bg-exp-charcoal-blue hover:bg-exp-dark-navy text-white",
  },
  primary: {
    card: "border",
    icon: "bg-primary/10 text-primary",
    button: "",
  },
};

interface RowCard {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  buttonText: string;
  theme: keyof typeof themeStyles;
  onClick?: () => void;
}

function CarouselRow({ title, cards }: { title: string; cards: RowCard[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.scrollWidth / cards.length;
      setCurrent(Math.round(scrollLeft / cardWidth));
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [cards.length]);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / cards.length;
    el.scrollTo({ left: cardWidth * index, behavior: "smooth" });
  };

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-section-title">{title}</h2>
      <div
        ref={scrollRef}
        className="flex flex-col md:flex-row gap-3 md:overflow-x-auto md:pb-2 md:snap-x md:snap-mandatory md:scrollbar-none"
      >
        {cards.map((card) => {
          const styles = themeStyles[card.theme];
          const Icon = card.icon;
          return (
            <div key={card.id} className="w-full md:min-w-0 md:flex-1 md:snap-start">
              <Card className={cn("h-full", styles.card)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", styles.icon)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1">{card.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{card.description}</p>
                      <Button size="sm" className={cn("gap-2", styles.button)} onClick={card.onClick}>
                        {card.buttonText}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
      {cards.length > 1 && (
        <div className="flex justify-center gap-1.5 md:hidden">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i === current ? "bg-primary" : "bg-muted-foreground/30"
              )}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function GrowthAndDevelopmentRows() {
  const [open, setOpen] = useState(false);

  const growthCards: RowCard[] = [
    {
      id: "revshare",
      icon: Play,
      title: "Revenue Share Explained",
      description: "Learn how to build passive income through eXp's revenue share program.",
      buttonText: "Watch Video",
      theme: "blue",
    },
    {
      id: "stock",
      icon: TrendingUp,
      title: "Stock Purchase Program",
      description: "Build wealth through eXp's employee stock purchase plan with company match.",
      buttonText: "Enroll Now",
      theme: "gold",
    },
  ];

  const devCards: RowCard[] = [
    {
      id: "disc",
      icon: Target,
      title: "DISC Assessment",
      description: "Understand your communication style and improve client relationships.",
      buttonText: "Take Assessment",
      theme: "slate",
    },
    {
      id: "nps",
      icon: MessageCircleQuestion,
      title: "Your Feedback",
      description: "Fill out the agent eXp NPS survey today!",
      buttonText: "Take Survey",
      theme: "green",
      onClick: () => setOpen(true),
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <CarouselRow title="Financial Growth" cards={growthCards} />
        <CarouselRow title="Professional Development" cards={devCards} />
      </div>

      <NpsSurveyModal open={open} onOpenChange={setOpen} />
    </>
  );
}
