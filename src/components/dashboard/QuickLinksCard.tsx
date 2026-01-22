import { useState } from "react";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { quickLinks } from "@/data/mockData";

const slides = [
  {
    title: "eXp Quick Links",
    subtitle: "Access essential resources",
    gradient: true,
  },
  {
    title: "Training Resources",
    subtitle: "Boost your skills",
    gradient: false,
  },
  {
    title: "Marketing Tools",
    subtitle: "Grow your business",
    gradient: false,
  },
];

export function QuickLinksCard() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">What's New</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Carousel */}
        <div className="relative">
          <div
            className={`rounded-lg p-6 ${
              slides[currentSlide].gradient
                ? "gradient-blue text-white"
                : "bg-muted"
            }`}
          >
            <h3 className="text-xl font-bold mb-1">{slides[currentSlide].title}</h3>
            <p className={slides[currentSlide].gradient ? "text-white/80" : "text-muted-foreground"}>
              {slides[currentSlide].subtitle}
            </p>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 hover:bg-background"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-background/80 hover:bg-background"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-exp-blue" : "bg-muted"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          {quickLinks.map((link) => (
            <a
              key={link.title}
              href={link.url}
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              <span className="font-medium text-sm">{link.title}</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
