import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Store, Download } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { TemplateCard } from "@/components/marketplace/TemplateCard";
import { useDashboard } from "@/contexts/DashboardContext";
import { mockTemplates } from "@/data/mockTemplates";
import { TemplateCategory, DashboardTemplate } from "@/types/dashboard";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ReportMarketplace() {
  const navigate = useNavigate();
  const { templates: userTemplates, applyTemplate } = useDashboard();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'installs'>('popular');
  const [showSharedOnly, setShowSharedOnly] = useState(false);
  const [confirmInstallId, setConfirmInstallId] = useState<string | null>(null);

  // Combine user templates with mock templates (ensure userTemplates is always an array)
  const allTemplates = useMemo(() => {
    const safeUserTemplates = Array.isArray(userTemplates) ? userTemplates : [];
    return [...safeUserTemplates, ...mockTemplates];
  }, [userTemplates]);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let result = allTemplates;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result = [...result].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'installs':
        result = [...result].sort((a, b) => b.installCount - a.installCount);
        break;
    }

    return result;
  }, [allTemplates, searchQuery, selectedCategory, sortBy]);

  const totalInstalls = useMemo(() => {
    return allTemplates.reduce((sum, t) => sum + t.installCount, 0);
  }, [allTemplates]);

  const handleInstall = (templateId: string) => {
    setConfirmInstallId(templateId);
  };

  const confirmInstall = () => {
    if (confirmInstallId) {
      applyTemplate(confirmInstallId);
      toast.success("Template installed successfully!");
      navigate("/");
    }
    setConfirmInstallId(null);
  };

  const templateToInstall = confirmInstallId 
    ? allTemplates.find(t => t.id === confirmInstallId) 
    : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <Store className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Report Marketplace</h1>
              <p className="text-sm text-muted-foreground">
                Discover and install report templates from top performers
              </p>
            </div>
          </div>

          <Button variant="outline" className="gap-2 shrink-0">
            <Download className="h-4 w-4" />
            Shared with You
            <Badge variant="secondary" className="ml-1">New</Badge>
          </Button>
        </div>

        {/* Filters */}
        <MarketplaceFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Stats */}
        <p className="text-sm text-muted-foreground">
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} • {totalInstalls.toLocaleString()} total installs
        </p>

        {/* Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onInstall={handleInstall}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Store className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg mb-1">No templates found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Install Confirmation Dialog */}
      <AlertDialog open={!!confirmInstallId} onOpenChange={() => setConfirmInstallId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Install Template</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current dashboard with "{templateToInstall?.name}". 
              You can always reset to the default layout later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmInstall}>Install Template</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
