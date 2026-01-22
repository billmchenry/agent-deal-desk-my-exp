import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CappingYearCard } from "@/components/dashboard/CappingYearCard";
import { UplinePartnersCard } from "@/components/dashboard/UplinePartnersCard";
import { InfluencerStatusCard } from "@/components/dashboard/InfluencerStatusCard";
import { AchievementsCard } from "@/components/dashboard/AchievementsCard";
import { QuickLinksCard } from "@/components/dashboard/QuickLinksCard";
import { UniversityCard } from "@/components/dashboard/UniversityCard";
import { PromoBanners } from "@/components/dashboard/PromoBanners";
import { ImportantUpdateCard } from "@/components/dashboard/ImportantUpdateCard";
import { DISCCard } from "@/components/dashboard/DISCCard";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <CappingYearCard />
          <UplinePartnersCard />
          <InfluencerStatusCard />
          <DISCCard />
          <PromoBanners />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AchievementsCard />
          <QuickLinksCard />
          <UniversityCard />
          <ImportantUpdateCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
