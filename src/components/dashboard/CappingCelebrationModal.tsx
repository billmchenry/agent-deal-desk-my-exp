import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ConfettiCelebration } from "@/components/shared/ConfettiCelebration";
import { useNavigate, useLocation } from "react-router-dom";

interface CappingCelebrationModalProps {
  open: boolean;
  onDismiss: () => void;
}

export function CappingCelebrationModal({ open, onDismiss }: CappingCelebrationModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {open && <ConfettiCelebration />}
      <Dialog open={open} onOpenChange={(v) => !v && onDismiss()}>
        <DialogContent className="sm:max-w-md text-center p-8 gap-0 border-none outline-none ring-0 [&>button]:hidden">
          {/* Checkmark circle */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#2D2A6E]">
            <Check className="h-10 w-10 text-white" strokeWidth={3} />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            Congratulations!
          </h2>
          <h3 className="text-lg font-semibold text-foreground mb-3">
            You've Hit Your Cap!
          </h3>
          <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto">
            Amazing work! You've reached your $16,000 cap. From here on out, you keep even more of your commission. Keep up the momentum!
          </p>

          <Button
            size="lg"
            className="w-full mb-3 bg-[#2D2A6E] hover:bg-[#4A47A3] text-white"
            onClick={() => {
              onDismiss();
              navigate("/agent/dashboard");
            }}
          >
            View My Dashboard
          </Button>

          {!isHome && (
            <button
              onClick={() => {
                onDismiss();
                navigate("/");
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Home
            </button>
          )}

          {isHome && (
            <button
              onClick={onDismiss}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dismiss
            </button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
