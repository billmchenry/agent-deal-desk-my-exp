// Mock data for the MY | eXp Dashboard
// All names have been replaced with fictional alternatives

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role?: string;
}

export interface UplinePartner extends Agent {
  level: number;
  isContributor?: boolean;
}

export const currentUser: Agent = {
  id: "1",
  name: "Michael Thompson",
  email: "michael.thompson@exp.com",
  phone: "(555) 123-4567",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  role: "Agent",
};

export const uplinePartners: UplinePartner[] = [
  {
    id: "2",
    name: "James Anderson",
    email: "james.anderson@exp.com",
    phone: "(555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    level: 1,
    isContributor: true,
  },
  {
    id: "3",
    name: "David Williams",
    email: "david.williams@exp.com",
    phone: "(555) 345-6789",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    level: 2,
    isContributor: true,
  },
  {
    id: "4",
    name: "Maria Garcia",
    email: "maria.garcia@exp.com",
    phone: "(555) 456-7890",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    level: 3,
    isContributor: true,
  },
  {
    id: "5",
    name: "Sarah Johnson",
    email: "sarah.johnson@exp.com",
    phone: "(555) 567-8901",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    level: 4,
    isContributor: true,
  },
  {
    id: "6",
    name: "Robert Martinez",
    email: "robert.martinez@exp.com",
    phone: "(555) 678-9012",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    level: 5,
    isContributor: true,
  },
  {
    id: "7",
    name: "Emily Davis",
    email: "emily.davis@exp.com",
    phone: "(555) 789-0123",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    level: 6,
    isContributor: false,
  },
];

export const cappingData = {
  status: "Uncapped",
  current: 482,
  target: 16000,
  units: 5,
  gci: 2670,
  volume: 1780000,
};

export const influencerTiers = [
  { name: "Agents", level: 1, completed: true },
  { name: "Builders", level: 2, completed: true },
  { name: "Leaders", level: 3, completed: false },
  { name: "Beta", level: 4, completed: false },
  { name: "Alpha Legacy", level: 5, completed: false },
];

export const achievements = {
  flqa: {
    status: "QUALIFIED",
    amount: 1543.75,
    date: "Nov 18 2024",
  },
};

export const quickLinks = [
  { title: "eXp Courses", url: "#" },
  { title: "YouTube", url: "#" },
  { title: "KGCI Real Estate", url: "#" },
];

export const navItems = [
  {
    title: "Agent",
    icon: "User",
    hasSubmenu: true,
    submenu: [
      { title: "Profile", url: "/agent/profile" },
      { title: "Documents", url: "/agent/documents" },
      { title: "Settings", url: "/agent/settings" },
    ],
  },
  {
    title: "Team",
    icon: "Users",
    url: "/team",
  },
  {
    title: "RevShare Earnings",
    icon: "DollarSign",
    hasSubmenu: true,
    submenu: [
      { title: "Overview", url: "/revshare/overview" },
      { title: "History", url: "/revshare/history" },
    ],
  },
  {
    title: "Documents",
    icon: "FileText",
    hasSubmenu: true,
    submenu: [
      { title: "All Documents", url: "/documents/all" },
      { title: "Templates", url: "/documents/templates" },
    ],
  },
  {
    title: "Events Calendar",
    icon: "Calendar",
    url: "/events",
  },
  {
    title: "Mentor Program",
    icon: "GraduationCap",
    url: "/mentor",
  },
  {
    title: "Tools",
    icon: "Wrench",
    url: "/tools",
  },
  {
    title: "Knowledge Base",
    icon: "BookOpen",
    url: "/knowledge",
  },
  {
    title: "Help Center",
    icon: "HelpCircle",
    url: "/help",
  },
];
