import { Bell, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface NotificationsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications = [
  {
    id: 1,
    title: "New transaction pending",
    description: "123 Main St requires your signature",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    title: "Commission deposited",
    description: "$4,250 has been deposited to your account",
    time: "Yesterday",
    unread: true,
  },
  {
    id: 3,
    title: "Training reminder",
    description: "Compliance training due in 3 days",
    time: "2 days ago",
    unread: true,
  },
];

export function NotificationsSheet({ isOpen, onClose }: NotificationsSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-sm p-0">
        <SheetHeader className="flex h-16 flex-row items-center justify-between border-b px-4">
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col overflow-y-auto">
          {mockNotifications.map((notification) => (
            <button
              key={notification.id}
              className="flex flex-col gap-1 border-b p-4 text-left hover:bg-muted transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-sm">{notification.title}</span>
                {notification.unread && (
                  <span className="h-2 w-2 rounded-full bg-exp-blue shrink-0 mt-1.5" />
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {notification.description}
              </span>
              <span className="text-xs text-muted-foreground">
                {notification.time}
              </span>
            </button>
          ))}

          <div className="p-4">
            <Button variant="outline" className="w-full">
              View all notifications
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
