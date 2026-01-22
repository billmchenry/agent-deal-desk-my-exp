import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Award, Trophy, Target, Star } from "lucide-react";

export default function IconProgram() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">ICON Program</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Award className="h-12 w-12 text-primary mb-4" />
              <p className="text-sm text-muted-foreground mb-1">Current Status</p>
              <p className="text-xl font-semibold text-foreground">Agent</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Trophy className="h-12 w-12 text-primary mb-4" />
              <p className="text-sm text-muted-foreground mb-1">Next Milestone</p>
              <p className="text-xl font-semibold text-foreground">ICON</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Target className="h-12 w-12 text-primary mb-4" />
              <p className="text-sm text-muted-foreground mb-1">Progress</p>
              <p className="text-xl font-semibold text-foreground">3%</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Star className="h-12 w-12 text-primary mb-4" />
              <p className="text-sm text-muted-foreground mb-1">Awards Earned</p>
              <p className="text-xl font-semibold text-foreground">0</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ICON Program Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The ICON Agent Award program recognizes agents who have achieved exceptional 
              production and contribution to eXp Realty. Complete the following requirements 
              to earn your ICON status:
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">•</span>
                Cap in a single anniversary year ($16,000 company dollar)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">•</span>
                Personally sponsor at least 2 agents who each close at least one transaction
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">•</span>
                Attend EXPCON or a designated eXp Realty event
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">•</span>
                Complete required cultural and training requirements
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
