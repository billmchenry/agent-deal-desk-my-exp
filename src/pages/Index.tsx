import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CustomizableDashboard } from "@/components/dashboard/CustomizableDashboard";

const Index = () => {
  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Welcome to eXp!</h1>
        <p className="text-muted-foreground">Hi Clifford!</p>
      </div>

      {/* Fully Customizable Dashboard */}
      <CustomizableDashboard />
    </DashboardLayout>
  );
};

export default Index;
