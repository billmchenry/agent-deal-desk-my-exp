import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Sun, Moon, FlaskConical } from "lucide-react";
import { useTheme } from "next-themes";
import { DemoConfigSheet } from "./DemoConfigSheet";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { currentUser, userProfile } from "@/data/mockData";
import { useTranslation } from "@/hooks/useTranslation";

interface AccountSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountSheet({ isOpen, onClose }: AccountSheetProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [demoConfigOpen, setDemoConfigOpen] = useState(false);

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };
  const themeLabel = theme === "light" ? t("header.switchDark") : theme === "dark" ? t("header.switchSystem") : t("header.switchLight");
  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-sm p-0">
        <SheetHeader className="flex h-16 flex-row items-center border-b px-4">
          <SheetTitle>{t("header.accountMenu")}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col">
          <div className="flex items-center gap-4 p-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="bg-exp-blue text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{currentUser.name}</p>
              <p className="text-sm text-muted-foreground">{userProfile.agentId}</p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col py-2">
            <button
              onClick={() => handleNavigate("/profile/personal-details")}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
            >
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{t("header.personalDetails")}</span>
            </button>

            <button
              onClick={() => handleNavigate("/profile/settings")}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{t("header.settings")}</span>
            </button>
          </div>

          <Separator />

          <div className="p-4">
            <Button variant="outline" className="w-full text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4 me-2" />
              {t("header.signOut")}
            </Button>
          </div>

          <div className="mt-auto p-4 border-t">
            <p className="text-xs text-muted-foreground text-center">{t("header.version")} 2.1.0</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
