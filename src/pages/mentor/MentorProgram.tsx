import { Phone, Mail, ExternalLink, Trophy } from "lucide-react";
import mentorHeader from "@/assets/mentor-program-header.png";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock mentee data – will be driven by user scenario later
const menteeData = {
  mentor: {
    name: "Robert Conat",
    avatarUrl: "",
    phone: "(555) 482-9173",
    email: "robert.conat@exprealty.com",
  },
  transactionsCompleted: 0,
  transactionsRequired: 3,
};

export default function MentorProgram() {
  useDocumentTitle("Mentor Program");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mentor, transactionsCompleted, transactionsRequired } = menteeData;
  const progressPct = (transactionsCompleted / transactionsRequired) * 100;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8 py-4">
        {/* Header */}
        <div className="bg-card rounded-xl p-8 flex flex-col items-center">
          <div className="bg-white rounded-xl px-8 py-4 inline-block">
            <img
              src={mentorHeader}
              alt="eXp Realty Mentor Program"
              className="h-14 md:h-16 object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-foreground">{t("mentor.forMentees")}</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto text-center mt-2">
            {t("mentor.menteeDescription")}
          </p>
        </div>

        {/* Two-card row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* My Mentor card */}
          <Card className="relative">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{t("mentor.myMentor")}</p>
                  <p className="text-sm text-muted-foreground">{mentor.name}</p>
                </div>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {mentor.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-lg"
                  asChild
                >
                  <a href={`tel:${mentor.phone}`} aria-label={t("mentor.callMentor")}>
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-lg"
                  asChild
                >
                  <a href={`mailto:${mentor.email}`} aria-label={t("mentor.emailMentor")}>
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Training Materials card */}
          <Card className="relative">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div>
                <p className="text-sm font-semibold text-foreground">{t("mentor.trainingMaterials")}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("mentor.trainingDescription")}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-lg"
                onClick={() => toast.info(t("mentor.trainingNotAvailable"))}
                aria-label={t("mentor.openTraining")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* My Transactions progress */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <button
              type="button"
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
              onClick={() => navigate("/agent/dashboard")}
            >
              {t("mentor.myTransactions")}
            </button>
            <Progress value={progressPct} className="h-2" />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Trophy className="h-3.5 w-3.5" />
                <span>{transactionsCompleted}</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">{transactionsRequired}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
