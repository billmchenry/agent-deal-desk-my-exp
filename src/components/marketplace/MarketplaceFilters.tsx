import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TemplateCategory, CATEGORY_STYLES } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface MarketplaceFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: TemplateCategory | 'all';
  onCategoryChange: (category: TemplateCategory | 'all') => void;
  sortBy: 'popular' | 'newest' | 'installs';
  onSortChange: (sort: 'popular' | 'newest' | 'installs') => void;
}

const categories: { value: TemplateCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'production', label: 'Production' },
  { value: 'team', label: 'Team' },
  { value: 'growth', label: 'Growth' },
  { value: 'custom', label: 'Custom' },
];

const sortOptions: { value: 'popular' | 'newest' | 'installs'; label: string }[] = [
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'installs', label: 'Most Installed' },
];

export function MarketplaceFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: MarketplaceFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                All Categories
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.value}
                  onClick={() => onCategoryChange(cat.value)}
                  className={selectedCategory === cat.value ? "bg-muted" : ""}
                >
                  {cat.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                {sortOptions.find(s => s.value === sortBy)?.label}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={sortBy === option.value ? "bg-muted" : ""}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.value;
          const style = cat.value !== 'all' ? CATEGORY_STYLES[cat.value] : null;

          return (
            <Button
              key={cat.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(cat.value)}
              className={cn(
                "shrink-0",
                isActive && cat.value !== 'all' && style && cn(style.bg, style.text, "hover:opacity-90 border-0")
              )}
            >
              {cat.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
