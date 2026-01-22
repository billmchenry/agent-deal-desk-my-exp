import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Download, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Fake names for the organization tree
const orgTreeAgents = [
  { id: 1, name: "Samantha Rose Bennett", location: "Roseville, CA", level: 1, revShare: "$6,487.88", contribution: "0.00 USD", orgSize: 42, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
  { id: 2, name: "Derek James Sullivan", location: "Lincoln, CA", level: 1, revShare: "$8,234.56", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
  { id: 3, name: "Natalie Grace Harper", location: "Roseville, CA", level: 1, revShare: "$4,980.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
  { id: 4, name: "Marcus Antonio Rivera", location: "Folsom, CA", level: 1, revShare: "$1,890.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
  { id: 5, name: "Christopher Paul Mitchell", location: "Citrus Heights, CA", level: 1, revShare: "$2,890.00", contribution: "0.00 USD", orgSize: 41, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
  { id: 6, name: "Victoria Lynn Patterson", location: "Orangevale, CA", level: 1, revShare: "$1,420.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
  { id: 7, name: "Amanda Claire Foster", location: "Roseville, CA", level: 1, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 1, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face" },
  { id: 8, name: "Brandon Lee Cooper", location: "Elk Grove, CA", level: 1, revShare: "$2,100.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face" },
  { id: 9, name: "Melissa Ann Richardson", location: "Citrus Heights, CA", level: 2, revShare: "$1,115.00", contribution: "0.00 USD", orgSize: 1, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face" },
  { id: 10, name: "Tyler James Henderson", location: "Granite Bay, CA", level: 2, revShare: "$890.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face" },
  { id: 11, name: "Rebecca Marie Coleman", location: "Auburn, CA", level: 2, revShare: "$1,540.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face" },
  { id: 12, name: "Andrew William Brooks", location: "Granite Bay, CA", level: 2, revShare: "$2,340.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face" },
  { id: 13, name: "Daniel Scott Peterson", location: "Carson City, NV", level: 3, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face" },
  { id: 14, name: "Lauren Michelle Torres", location: "Roseville, CA", level: 3, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face" },
  { id: 15, name: "Nicole Christine Edwards", location: "Lincoln, CA", level: 3, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop&crop=face" },
  { id: 16, name: "Ryan Patrick Murphy", location: "Lincoln, CA", level: 3, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1507081323647-4d250478b919?w=150&h=150&fit=crop&crop=face" },
  { id: 17, name: "Jessica Anne Crawford", location: "Fair Oaks, CA", level: 4, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 1, avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face" },
  { id: 18, name: "Kevin Michael Sanders", location: "Roseville, CA", level: 4, revShare: "$3,800.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop&crop=face" },
  { id: 19, name: "Stephanie Marie Wallace", location: "Orangevale, CA", level: 4, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face" },
  { id: 20, name: "Jonathan David Reynolds", location: "Roseville, CA", level: 4, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 0, avatar: "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=150&h=150&fit=crop&crop=face" },
];

const getLevelColor = (level: number) => {
  const colors: Record<number, string> = {
    1: "bg-yellow-400",
    2: "bg-green-400",
    3: "bg-blue-400",
    4: "bg-purple-400",
    5: "bg-pink-400",
    6: "bg-orange-400",
    7: "bg-red-400",
  };
  return colors[level] || "bg-gray-400";
};

export default function OrganizationTree() {
  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">Organization Tree</h1>
            <span className="text-primary hover:underline cursor-pointer text-sm">View in Beta</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Select defaultValue="high-low">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by Rev Share" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-low">Contributed Rev Share: High to Low</SelectItem>
              <SelectItem value="low-high">Contributed Rev Share: Low to High</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>

          <div className="flex-1" />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search first/last name or Location (min 3 characters)" 
              className="pl-9 w-[350px]"
            />
          </div>
        </div>

        {/* Current User */}
        <div className="mb-6">
          <p className="text-lg font-medium text-foreground mb-2">Michael Thompson - Level 0</p>
          <p className="text-sm text-muted-foreground">63 FLAs</p>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {orgTreeAgents.map((agent) => (
            <Card key={agent.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={agent.avatar} />
                    <AvatarFallback className="bg-muted">
                      {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Badge className={`${getLevelColor(agent.level)} text-white text-xs`}>
                    Level {agent.level}
                  </Badge>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contributed Rev Share:</span>
                    <span className="font-medium text-yellow-600">{agent.revShare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Individual Rev Share Contribution:</span>
                    <span className="text-foreground">{agent.contribution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Org Size:</span>
                    <span className="text-foreground">{agent.orgSize}</span>
                  </div>
                </div>

                {agent.orgSize > 0 && (
                  <Badge variant="outline" className="mt-3 text-xs text-primary border-primary">
                    View Org
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}