import { useState } from "react";
import { ArrowRight, TrendingUp, Play, Target, MessageCircleQuestion } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
    button: "bg-exp-blue hover:bg-exp-blue/90",
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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api]);

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-section-title">{title}</h2>
      <Carousel opts={{ loop: false, align: "start" }} setApi={setApi}>
        <CarouselContent>
          {cards.map((card) => {
            const styles = themeStyles[card.theme];
            const Icon = card.icon;
            return (
              <CarouselItem key={card.id} className="basis-[85%] md:basis-1/2">
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
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      {cards.length > 1 && (
        <div className="flex justify-center gap-1.5 md:hidden">
          {cards.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i === current ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function GrowthAndDevelopmentRows() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [score, setScore] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [improvement, setImprovement] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setStep(1);
    setScore(null);
    setReason("");
    setImprovement("");
  };

  const handleSubmit = () => {
    setOpen(false);
    toast.success("Thank you for your feedback!");
  };

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
      theme: "purple",
    },
    {
      id: "nps",
      icon: MessageCircleQuestion,
      title: "Your Feedback",
      description: "Fill out the agent eXp NPS survey today!",
      buttonText: "Take Survey",
      theme: "primary",
      onClick: handleOpen,
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <CarouselRow title="Financial Growth" cards={growthCards} />
        <CarouselRow title="Professional Development" cards={devCards} />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Instant NPS Survey</DialogTitle>
              <span className="text-xs text-muted-foreground">
                {step === 1 ? "0" : "1"} of 2 complete
              </span>
            </div>
          </DialogHeader>

          {step === 1 ? (
            <div className="space-y-6 py-2">
              <p className="text-sm">
                Based on your experience so far, how likely are you to recommend eXp to a friend or colleague?
              </p>
              <div className="flex items-center gap-2 justify-center flex-wrap">
                <span className="text-xs text-muted-foreground mr-1">Not Likely</span>
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setScore(i)}
                    className={cn(
                      "h-9 w-9 rounded-md border text-sm font-medium transition-colors",
                      score === i
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-muted border-border"
                    )}
                  >
                    {i}
                  </button>
                ))}
                <span className="text-xs text-muted-foreground ml-1">Extremely Likely</span>
              </div>
            </div>
          ) : (
            <div className="space-y-5 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  What most influenced you to give us this score?
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="min-h-[80px] resize-none"
                  maxLength={4000}
                />
                <p className="text-xs text-muted-foreground text-right">{reason.length} / 4000</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Is there anything we could have done to make your experience more exceptional?
                </label>
                <Textarea
                  value={improvement}
                  onChange={(e) => setImprovement(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="min-h-[80px] resize-none"
                  maxLength={4000}
                />
                <p className="text-xs text-muted-foreground text-right">{improvement.length} / 4000</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">eXp Email Address</p>
                <p className="text-sm text-muted-foreground">clifford.thompson@exprealty.com</p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            {step === 1 ? (
              <Button onClick={() => { if (score !== null) setStep(2); }} disabled={score === null}>Continue</Button>
            ) : (
              <Button onClick={handleSubmit}>Submit</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
