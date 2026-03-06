import { useState, useEffect } from "react";
import { Phone, Mail, ExternalLink, Trophy, GraduationCap, Users, ClipboardList, UserCircle } from "lucide-react";
import mentorHeader from "@/assets/mentor-program-header.png";
import { useDemoConfig } from "@/contexts/DemoConfigContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { mockMentees, mockMentorRequests } from "@/data/mentorMockData";

type MentorScenario = "mentee" | "not_applied" | "pending" | "approved_certification" | "active_mentor";

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

function MentorHeader() {
  return (
    <div className="bg-white rounded-xl px-8 py-4 inline-block">
      <img src={mentorHeader} alt="eXp Realty Mentor Program" className="h-14 md:h-16 object-contain" />
    </div>
  );
}

// ── Mentee view ──
function MenteeView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mentor, transactionsCompleted, transactionsRequired } = menteeData;
  const progressPct = (transactionsCompleted / transactionsRequired) * 100;

  return (
    <>
      <div className="bg-card rounded-xl p-8 flex flex-col items-center">
        <MentorHeader />
        <h2 className="text-xl font-bold text-foreground mt-4">{t("mentor.forMentees")}</h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto text-center mt-2">
          {t("mentor.menteeDescription")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg" asChild>
                <a href={`tel:${mentor.phone}`} aria-label={t("mentor.callMentor")}><Phone className="h-4 w-4" /></a>
              </Button>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg" asChild>
                <a href={`mailto:${mentor.email}`} aria-label={t("mentor.emailMentor")}><Mail className="h-4 w-4" /></a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
            <div>
              <p className="text-sm font-semibold text-foreground">{t("mentor.trainingMaterials")}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("mentor.trainingDescription")}</p>
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg" onClick={() => toast.info(t("mentor.trainingNotAvailable"))} aria-label={t("mentor.openTraining")}>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5 space-y-3">
          <button type="button" className="text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer" onClick={() => navigate("/agent/dashboard")}>
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
    </>
  );
}

// ── For Mentors - Not Applied ──
function NotAppliedView() {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-card rounded-xl p-8 flex flex-col items-center">
        <MentorHeader />
        <h2 className="text-xl font-bold text-foreground mt-4">For Mentors</h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto text-center mt-2">
          Ready to share your expertise? As a mentor, you'll guide new agents through their first transactions,
          help them build confidence, and earn mentor fees along the way.
        </p>
      </div>

      <Card>
        <CardContent className="p-8 flex flex-col items-center gap-4">
          <Button size="lg" className="text-base px-8" onClick={() => navigate("/mentor/apply")}>
            I Want to Be a Mentor
          </Button>
          <p className="text-xs text-muted-foreground text-center max-w-md">
            If you have already submitted an application, you will be notified once your broker has reviewed it.
            Please allow up to 5 business days for processing.
          </p>
        </CardContent>
      </Card>
    </>
  );
}

// ── Pending view ──
function PendingView() {
  return (
    <>
      <div className="bg-card rounded-xl p-8 flex flex-col items-center">
        <MentorHeader />
        <h2 className="text-xl font-bold text-foreground mt-4">For Mentors</h2>
      </div>

      <Card>
        <CardContent className="p-8 flex flex-col items-center gap-3 text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Application Submitted</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Your mentor application has been submitted and is pending broker approval.
            You will be notified once your application has been reviewed. Please allow up to 5 business days for processing.
          </p>
        </CardContent>
      </Card>
    </>
  );
}

// ── Approved / Certification view ──
function CertificationView() {
  return (
    <>
      <div className="bg-card rounded-xl p-8 flex flex-col items-center">
        <MentorHeader />
        <h2 className="text-xl font-bold text-foreground mt-4">For Mentors</h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto text-center mt-2">
          Congratulations on being approved as a mentor! Complete your certification training to begin accepting mentees.
        </p>
      </div>

      <Card className="border-primary/30">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <GraduationCap className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-foreground">Complete your Certification NOW!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You must complete the mentor certification training before you can be assigned mentees.
            </p>
          </div>
          <Button size="lg" onClick={() => toast.info("Training materials are not yet available.")}>
            Start Training
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

// ── Active Mentor view ──
function ActiveMentorView() {
  const navigate = useNavigate();
  const menteeCount = mockMentees.length;
  const requestCount = mockMentorRequests.length;

  return (
    <>
      <div className="bg-card rounded-xl p-8 flex flex-col items-center">
        <MentorHeader />
        <h2 className="text-xl font-bold text-foreground mt-4">For Mentors</h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto text-center mt-2">
          Congratulations! You have completed your Mentor Certification course, and are now a Certified Mentor!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => navigate("/mentor/mentees")}
        >
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">My Mentees</h3>
            <span className="text-2xl font-bold text-foreground">{menteeCount}</span>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => navigate("/mentor/requests")}
        >
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${requestCount > 0 ? "bg-destructive/10" : "bg-primary/10"}`}>
              <ClipboardList className={`h-6 w-6 ${requestCount > 0 ? "text-destructive" : "text-primary"}`} />
            </div>
            <h3 className="text-base font-semibold text-foreground">My Mentor Requests</h3>
            <span className={`text-2xl font-bold ${requestCount > 0 ? "text-destructive" : "text-foreground"}`}>{requestCount}</span>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => navigate("/profile/personal-details")}
        >
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">My Mentor Profile</h3>
            <span className="text-sm text-muted-foreground">View & edit</span>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// ── Main page ──
export default function MentorProgram() {
  useDocumentTitle("Mentor Program");
  const { config } = useDemoConfig();

  // Derive scenario from global demo config
  const mentorModes: MentorScenario[] = ["mentee", "not_applied", "pending", "approved_certification", "active_mentor"];
  const scenario: MentorScenario = mentorModes.includes(config.mentorMode as MentorScenario)
    ? (config.mentorMode as MentorScenario)
    : "not_applied";

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8 py-4">
        {scenario === "mentee" && <MenteeView />}
        {scenario === "not_applied" && <NotAppliedView />}
        {scenario === "pending" && <PendingView />}
        {scenario === "approved_certification" && <CertificationView />}
        {scenario === "active_mentor" && <ActiveMentorView />}
      </div>
    </DashboardLayout>
  );
}
