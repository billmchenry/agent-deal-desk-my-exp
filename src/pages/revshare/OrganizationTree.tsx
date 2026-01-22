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
  { id: 1, name: "Audrey Camelia Chen", location: "Roseville, CA", level: 1, revShare: "$6,487.88", contribution: "0.00 USD", orgSize: 42, avatar: "" },
  { id: 2, name: "Lori Mills Walsh", location: "Lincoln, CA", level: 1, revShare: "$8,234.56", contribution: "0.00 USD", orgSize: 0, avatar: "" },
  { id: 3, name: "Kelly Elena Young", location: "Roseville, CA", level: 1, revShare: "$4,980.00", contribution: "0.00 USD", orgSize: 0, avatar: "" },
  { id: 4, name: "Eric Shiraz Ali", location: "Folsom, CA", level: 1, revShare: "$1,890.00", contribution: "0.00 USD", orgSize: 0, avatar: "" },
  { id: 5, name: "Randall Scott Morris", location: "Citrus Heights, CA", level: 1, revShare: "$2,890.00", contribution: "0.00 USD", orgSize: 41, avatar: "" },
  { id: 6, name: "Kathleen Lorraine Hernandez", location: "Orangevale, CA", level: 1, revShare: "$1,420.00", contribution: "0.00 USD", orgSize: 0, avatar: "" },
  { id: 7, name: "Jennifer D Mock", location: "Roseville, CA", level: 1, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 1, avatar: "" },
  { id: 8, name: "John D Koster", location: "Elk Grove, CA", level: 1, revShare: "$2,100.00", contribution: "0.00 USD", orgSize: 0, avatar: "" },
  { id: 9, name: "Roxanne E McGrath", location: "Citrus Heights, CA", level: 2, revShare: "$1,115.00", contribution: "0.00 USD", orgSize: 1, avatar: "" },
  { id: 10, name: "John Philip Olsen", location: "Granite Bay, CA", level: 2, revShare: "$890.00", contribution: "0.00 USD", orgSize: 0, avatar: "" },
  { id: 11, name: "Franklin D Burns", location: "Auburn, CA", level: 2, revShare: "$1,540.00", contribution: "0.00 USD", orgSize: 0, avatar: "" },
  { id: 12, name: "Kris Thompson Blair", location: "Granite Bay, CA", level: 2, revShare: "$2,340.00", contribution: "0.00 USD", orgSize: 0, avatar: "" },
  { id: 13, name: "John T Kellogg", location: "Carson City, NV", level: 3, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 0, avatar: "" },
  { id: 14, name: "Michael James Sparling", location: "Roseville, CA", level: 3, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 0, avatar: "" },
  { id: 15, name: "Allison Spence", location: "Lincoln, CA", level: 3, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 0, avatar: "" },
  { id: 16, name: "Alfred Lee Sparks", location: "Lincoln, CA", level: 3, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 0, avatar: "" },
  { id: 17, name: "Brendan Anthony Blake", location: "Fair Oaks, CA", level: 4, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 1, avatar: "" },
  { id: 18, name: "Matthew Dennis Loeffler", location: "Roseville, CA", level: 4, revShare: "$3,800.00", contribution: "0.00 USD", orgSize: 0, avatar: "" },
  { id: 19, name: "Jacquelyn Picasso-Aguilar", location: "Orangevale, CA", level: 4, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 0, avatar: "" },
  { id: 20, name: "Philip Wayne Hindman", location: "Roseville, CA", level: 4, revShare: "$3,215.00", contribution: "0.00 USD", orgSize: 0, avatar: "" },
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