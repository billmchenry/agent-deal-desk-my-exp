import * as React from "react";
import { ArrowRight, Target, TrendingUp, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const slides = [
  {
    id: "disc",
    icon: Target,
    title: "DISC Assessment",
    description: "Understand your communication style and improve client relationships.",
    buttonText: "Take Assessment",
    theme: "purple" as const,
  },
  {
    id: "stock",
    icon: TrendingUp,
    title: "Stock Purchase Program",
    description: "Build wealth through eXp's employee stock purchase plan with company match.",
    buttonText: "Learn More",
    theme: "gold" as const,
  },
  {
    id: "revshare",
    icon: Play,
    title: "Revenue Share Explained",
    description: "Learn how to build passive income through eXp's revenue share program.",
    buttonText: "Watch Video",
    theme: "blue" as const,
  },
];

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
};

export function PromotionalCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Auto-play effect
  React.useEffect(() => {
    if (!api || isHovered) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api, isHovered]);

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <div 
      className="space-y-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Carousel opts={{ loop: true }} setApi={setApi}>
        <CarouselContent className="-ml-0">
          {slides.map((slide) => {
            const styles = themeStyles[slide.theme];
            const Icon = slide.icon;

            return (
              <CarouselItem key={slide.id} className="pl-0">
                <Card className={styles.card}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{slide.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {slide.description}
                        </p>
                        <Button size="sm" className={`gap-2 ${styles.button}`}>
                          {slide.buttonText}
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

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => scrollTo(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === current
                ? "bg-primary"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
