import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function Settings() {
  useDocumentTitle("Settings");
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Settings content coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
