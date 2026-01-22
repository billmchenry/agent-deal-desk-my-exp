import { ExternalLink, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SettingCardProps {
  label: string;
  value: string;
  icon?: "edit" | "external";
  onClick?: () => void;
}

function SettingCard({ label, value, icon = "edit", onClick }: SettingCardProps) {
  return (
    <Card className="flex-1 min-w-[200px]">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="font-medium text-foreground">{value}</p>
        </div>
        <button
          onClick={onClick}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {icon === "edit" ? (
            <Pencil className="h-4 w-4" />
          ) : (
            <ExternalLink className="h-4 w-4" />
          )}
        </button>
      </CardContent>
    </Card>
  );
}

export function SettingsTab() {
  return (
    <div className="space-y-6">
      {/* Locale Section */}
      <Card className="bg-muted/50">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Locale</p>
            <p className="font-medium text-foreground">USA</p>
          </div>
          <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
            Change Locale
          </Button>
        </CardContent>
      </Card>

      {/* Preferences Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SettingCard label="Language" value="English" icon="edit" />
        <SettingCard label="Date Format" value="MM/DD/YYYY" icon="edit" />
        <SettingCard label="Time Format" value="12hrs" icon="edit" />
        <SettingCard label="Number Format" value="1,000,000.50" icon="edit" />
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SettingCard label="Security" value="Change Password" icon="external" />
        <SettingCard label="Login" value="Unlink Social Login" icon="external" />
        <SettingCard label="eXtend a Hand" value="Set up recurring donation" icon="external" />
      </div>

      {/* App Version */}
      <div className="pt-4">
        <p className="text-xs text-muted-foreground">App Version</p>
        <p className="text-sm text-foreground">3.4.2444</p>
      </div>
    </div>
  );
}
