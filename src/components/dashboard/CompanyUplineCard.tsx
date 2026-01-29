import { GraduationCap, Youtube, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const companyLinks = [
  {
    id: 1,
    title: "eXP University",
    subtitle: "YouTtorials",
    icon: GraduationCap,
    color: "bg-pink-500",
  },
  {
    id: 2,
    title: "YouTube",
    subtitle: "YouTube Tutorials",
    icon: Youtube,
    color: "bg-red-500",
  },
  {
    id: 3,
    title: "eXP Privite+",
    subtitle: "Hike Calendar",
    icon: Calendar,
    color: "bg-blue-500",
  },
];

export function CompanyUplineCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">👋</span>
          <CardTitle className="text-base font-semibold">Company with your Upline</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {companyLinks.map((link) => (
            <div
              key={link.id}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className={`h-10 w-10 rounded-full ${link.color} flex items-center justify-center`}>
                <link.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium">{link.title}</p>
                <p className="text-[10px] text-muted-foreground">{link.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
