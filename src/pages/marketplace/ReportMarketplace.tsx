import { useState, useMemo } from "react";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useNavigate } from "react-router-dom";
import { Store, Download } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UniversalFilterBar } from "@/components/filters";
import { TemplateCard } from "@/components/marketplace/TemplateCard";
import { useDashboard } from "@/contexts/DashboardContext";
import { mockTemplates } from "@/data/mockTemplates";
import { TemplateCategory, DashboardTemplate, CATEGORY_STYLES } from "@/types/dashboard";
import { toast } from "sonner";
import { useFormatters } from "@/hooks/useFormatters";
import { useTranslation } from "@/hooks/useTranslation";
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

const categories: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'production', label: 'Production' },
  { value: 'team', label: 'Team' },
  { value: 'growth', label: 'Growth' },
  { value: 'custom', label: 'Custom' },
];

const sortOptions = [
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'installs', label: 'Most Installed' },
];

export default function ReportMarketplace() {
  useDocumentTitle("Report Marketplace");
  const navigate = useNavigate();
  const { templates: userTemplates, applyTemplate } = useDashboard();
  const { formatNumber } = useFormatters();
  const { t } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('popular');
  const [confirmInstallId, setConfirmInstallId] = useState<string | null>(null);

  const allTemplates = useMemo(() => {
    const safeUserTemplates = Array.isArray(userTemplates) ? userTemplates : [];
    return [...safeUserTemplates, ...mockTemplates];
  }, [userTemplates]);

  const filteredTemplates = useMemo(() => {
    let result = allTemplates;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }
    switch (sortBy) {
      case 'popular': result = [...result].sort((a, b) => b.rating - a.rating); break;
      case 'newest': result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'installs': result = [...result].sort((a, b) => b.installCount - a.installCount); break;
    }
    return result;
  }, [allTemplates, searchQuery, selectedCategory, sortBy]);

  const totalInstalls = useMemo(() => allTemplates.reduce((sum, t) => sum + t.installCount, 0), [allTemplates]);

  const handleInstall = (templateId: string) => setConfirmInstallId(templateId);

  const confirmInstall = () => {
    if (confirmInstallId) {
      applyTemplate(confirmInstallId);
      toast.success("Template installed successfully!");
      navigate("/");
    }
    setConfirmInstallId(null);
  };

  const templateToInstall = confirmInstallId ? allTemplates.find(t => t.id === confirmInstallId) : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <Store className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t("nav.reportMarketplace")}</h1>
              <p className="text-sm text-muted-foreground">Discover and install report templates from top performers</p>
            </div>
          </div>
          <Button variant="outline" className="gap-2 shrink-0">
            <Download className="h-4 w-4" />
            Shared with You
            <Badge variant="secondary" className="ml-1">New</Badge>
          </Button>
        </div>

        {/* Unified filter bar */}
        <UniversalFilterBar>
          <UniversalFilterBar.Search
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search templates..."
            className="flex-1 min-w-[200px]"
          />
          <UniversalFilterBar.Dropdown
            label={t("filter.allCategories")}
            options={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
          <UniversalFilterBar.Dropdown
            label="Sort"
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
          />
        </UniversalFilterBar>

        {/* Category pills */}
        <UniversalFilterBar.Pills
          options={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
        />

        <p className="text-sm text-muted-foreground">
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} • {formatNumber(totalInstalls)} total installs
        </p>

        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} onInstall={handleInstall} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Store className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg mb-1">No templates found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

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
            <AlertDialogCancel>{t("profile.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmInstall}>Install Template</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
