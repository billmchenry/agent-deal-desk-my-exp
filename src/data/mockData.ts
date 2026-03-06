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
  phone: "(916) 555-4567",
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

export interface TopAgent {
  id: string;
  name: string;
  initials: string;
  rank: string;
  units: number;
  volume: number;
  commission: number;
  uuid: string;
  currency: string;
}

export const topAgents: TopAgent[] = [
  { id: "ta1", name: "Rachel Morrison", initials: "R", rank: "1 of 10", units: 6, volume: 2450000, commission: 73500, uuid: "a1b2c3d4-e5f6-11ec-8d9e-abcdef123456", currency: "USD" },
  { id: "ta2", name: "Daniel Crawford", initials: "D", rank: "2 of 10", units: 5, volume: 1890000, commission: 56700, uuid: "b2c3d4e5-f6a7-11ec-9e0f-bcdef1234567", currency: "USD" },
  { id: "ta3", name: "Amanda Chen-Rodriguez", initials: "A", rank: "3 of 10", units: 4, volume: 1520000, commission: 45600, uuid: "c3d4e5f6-a7b8-11ec-0f1a-cdef12345678", currency: "USD" },
  { id: "ta4", name: "Marcus Anthony Blake", initials: "M", rank: "4 of 10", units: 3, volume: 1150000, commission: 34500, uuid: "d4e5f6a7-b8c9-11ec-1a2b-def123456789", currency: "USD" },
  { id: "ta5", name: "Jennifer Walsh", initials: "J", rank: "5 of 10", units: 2, volume: 785000, commission: 23550, uuid: "e5f6a7b8-c9d0-11ec-2b3c-ef1234567890", currency: "USD" },
];

export interface OnboardingAgent {
  id: string;
  name: string;
  initials: string;
  joinDate: string;
  currentStep: string;
  nextStep: string;
  durationDays: number;
  progress: number;
  phone: string;
  email: string;
  state: string;
  country: string;
  sponsorName: string;
  teamId: string;
  teamName: string;
  joinId: string;
}

export const onboardingAgents: OnboardingAgent[] = [
  {
    id: "ob1", name: "Valerio Nieto", initials: "V", joinDate: "02/09/2026",
    currentStep: "License Transfer", nextStep: "Convert to Active", durationDays: 24, progress: 65,
    phone: "(619) 737-6503", email: "vnieto21@gmail.com", state: "CA", country: "US",
    sponsorName: "", teamId: "318", teamName: "New Vision Realty Group", joinId: "J423652",
  },
  {
    id: "ob2", name: "Tazio Galardi", initials: "T", joinDate: "11/03/2025",
    currentStep: "License Transfer", nextStep: "Convert to Active", durationDays: 122, progress: 60,
    phone: "(858) 555-0142", email: "tgalardi@email.com", state: "CA", country: "US",
    sponsorName: "", teamId: "318", teamName: "New Vision Realty Group", joinId: "J419830",
  },
];

export interface AgentDetail {
  id: string;
  agentName: string;
  uuid: string;
  agentId: string;
  active: string;
  teamMemberEffectiveDate: string;
  capResetDate: string;
  closedTransactions: number;
  salesVolume: number;
  companyDollarPaidThrough: number;
  capPercent: number;
}

export const agentDetails: AgentDetail[] = [
  { id: "ad1", agentName: "Daniel Crawford", uuid: "3064bef1-050b-11eb-95a1-f9e4050987ab", agentId: "12575", active: "Yes", teamMemberEffectiveDate: "10/01/2025", capResetDate: "03/01/2027", closedTransactions: 0, salesVolume: 0, companyDollarPaidThrough: 0, capPercent: 0 },
  { id: "ad2", agentName: "Michael Thompson", uuid: "31901ffd-050b-11eb-95a1-f7ea65bef00a", agentId: "13094", active: "Yes", teamMemberEffectiveDate: "03/01/2020", capResetDate: "03/01/2027", closedTransactions: 1, salesVolume: 10521, companyDollarPaidThrough: 0, capPercent: 12 },
  { id: "ad3", agentName: "Amanda Chen-Rodriguez", uuid: "3190e37b-050b-11eb-95a1-911eca2fb76a", agentId: "13244", active: "Yes", teamMemberEffectiveDate: "10/01/2025", capResetDate: "03/01/2027", closedTransactions: 0, salesVolume: 0, companyDollarPaidThrough: 0, capPercent: 0 },
  { id: "ad4", agentName: "Marcus Anthony Blake", uuid: "3198f948-050b-11eb-95a1-3bbcfc412583", agentId: "13762", active: "Yes", teamMemberEffectiveDate: "08/22/2018", capResetDate: "04/01/2026", closedTransactions: 0, salesVolume: 0, companyDollarPaidThrough: 0, capPercent: 45 },
  { id: "ad5", agentName: "Rachel Morrison", uuid: "5df4cc4b-053d-11eb-8ef5-c95598c86766", agentId: "13783", active: "Yes", teamMemberEffectiveDate: "08/22/2018", capResetDate: "04/01/2026", closedTransactions: 0, salesVolume: 0, companyDollarPaidThrough: 0, capPercent: 78 },
  { id: "ad6", agentName: "Jennifer Walsh", uuid: "a2b3c4d5-e6f7-11ec-1234-abcdef567890", agentId: "14201", active: "Yes", teamMemberEffectiveDate: "01/06/2025", capResetDate: "04/01/2026", closedTransactions: 0, salesVolume: 0, companyDollarPaidThrough: 0, capPercent: 100 },
];

export const teamOverview = {
  name: "New Vision Realty Group",
  units: { total: 13, pending: 2 },
  volume: { total: 5145000, pending: 1659000 },
  teamLeadSplit: { total: 2669, pending: 0 },
};

export const teamRequirements = [
  { label: "Total Agents Count", value: "70 out of 11", progress: 100, hasInfo: true },
  { label: "Total Closed Units", value: "13 out of 140", progress: 9 },
  { label: "Total Sales Volume", value: "5.15M / 40M", progress: 13 },
  { label: "Total Company Dollar Paid", value: "12.95K / 56K", progress: 23 },
  { label: "Average Unit Split To Team Leader", value: "3.08% (25% Average Required)", progress: 12, isWarning: true },
];

export interface UserProfile {
  agentId: string;
  nrdsId: string;
  depositLinkId: string;
  flags: string[];
  general: {
    legalFirstName: string;
    legalMiddleName: string;
    legalLastName: string;
    preferredName: string;
    expEmail: string;
    birthday: string;
    anniversaryDate: string;
    region: string;
  };
  contact: {
    phoneNumber: string;
    receiveText: boolean;
    fax: string;
    additionalPhoneNumbers: string;
  };
  email: {
    secondEmail: string;
    forwardingAddress: string;
  };
  addresses: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    country: string;
    state: string;
    zipCode: string;
  };
  emergencyContacts: {
    primary: {
      name: string;
      relationship: string;
      phoneNumber: string;
      email: string;
    };
    secondary: {
      name: string;
      relationship: string;
      phoneNumber: string;
      email: string;
    };
  };
  officeLocations: Array<{
    isPrimary: boolean;
    officeId: string;
    officeName: string;
    state: string;
    status: string;
    spaceDockerOfficeId: string;
  }>;
  activeMarkets: Array<{
    isPrimary: boolean;
    city: string;
    zipCode: string;
    state: string;
    country: string;
  }>;
  organizations: Array<{
    ouid: string;
    agentMlsId: string;
    globalId: string;
    organization: string;
    orgType: string;
    orgStatus: string;
    stateProvince: string;
    mlsOfficeCode: string;
  }>;
  teams: Array<{
    team: string;
    teamType: string;
    payplanName: string;
    teamStatus: string;
    teamAgentStatus: string;
    teamAgentRole: string;
    tmaEffectiveDate: string;
  }>;
  transactionPreferences: {
    splitCheckPreference: boolean;
  };
  licenses: Array<{
    division: string;
    licenseNumber: string;
    licenseFirstName: string;
    licenseLastName: string;
    isPrimary: boolean;
    expirationDate: string;
    state: string;
    brokerApprovalStatus: string;
    brokerApprovalSubmittedDate: string;
    brokerApprovalSubmittedBy: string;
    transferStatus: string;
    transferDate: string;
    transferBy: string;
  }>;
  mentorParticipation: "Mentor" | "Mentee" | "None";
  isPartnerAgent: boolean;
}

export const userProfile: UserProfile = {
  agentId: "AGT-847293",
  nrdsId: "284756847",
  depositLinkId: "DL-38472",
  flags: ["Commercial", "Referral"],
  general: {
    legalFirstName: "Michael",
    legalMiddleName: "James",
    legalLastName: "Thompson",
    preferredName: "Michael",
    expEmail: "michael.thompson@exprealty.com",
    birthday: "March 15",
    anniversaryDate: "01 Oct 2021",
    region: "Western",
  },
  contact: {
    phoneNumber: "(916) 555-4827",
    receiveText: true,
    fax: "-",
    additionalPhoneNumbers: "-",
  },
  email: {
    secondEmail: "mthompson.realty@gmail.com",
    forwardingAddress: "mthompson.realty@gmail.com",
  },
  addresses: {
    addressLine1: "1842 Oak Valley Drive",
    addressLine2: "",
    city: "Folsom",
    country: "US",
    state: "CA",
    zipCode: "95630",
  },
  emergencyContacts: {
    primary: {
      name: "Sarah Thompson",
      relationship: "Wife",
      phoneNumber: "(916) 555-3291",
      email: "sarah.thompson@gmail.com",
    },
    secondary: {
      name: "Robert Thompson",
      relationship: "Brother",
      phoneNumber: "(916) 555-7834",
      email: "rob.thompson@gmail.com",
    },
  },
  officeLocations: [
    {
      isPrimary: true,
      officeId: "4521",
      officeName: "eXp Realty of California Inc",
      state: "CA",
      status: "Active",
      spaceDockerOfficeId: "8374",
    },
    {
      isPrimary: false,
      officeId: "3847",
      officeName: "eXp Commercial",
      state: "CA",
      status: "Active",
      spaceDockerOfficeId: "9156",
    },
  ],
  activeMarkets: [
    {
      isPrimary: false,
      city: "Sacramento",
      zipCode: "95814",
      state: "California",
      country: "United States",
    },
  ],
  organizations: [
    {
      ouid: "A00000847",
      agentMlsId: "284756",
      globalId: "3842",
      organization: "Sacramento Association of Realtors",
      orgType: "Association",
      orgStatus: "Active",
      stateProvince: "CA",
      mlsOfficeCode: "-",
    },
  ],
  teams: [
    {
      team: "Thompson Realty Partners",
      teamType: "Mega",
      payplanName: "Mega Team Leader",
      teamStatus: "Active",
      teamAgentStatus: "Active",
      teamAgentRole: "Team_Leader",
      tmaEffectiveDate: "10/25/2021",
    },
  ],
  transactionPreferences: {
    splitCheckPreference: true,
  },
  licenses: [
    {
      division: "Residential",
      licenseNumber: "02847593",
      licenseFirstName: "Michael",
      licenseLastName: "Thompson",
      isPrimary: true,
      expirationDate: "09/23/2028",
      state: "CA",
      brokerApprovalStatus: "Approved",
      brokerApprovalSubmittedDate: "09/03/2021",
      brokerApprovalSubmittedBy: "marcus.chen@exprealty.net",
      transferStatus: "Complete",
      transferDate: "10/18/2021",
      transferBy: "jennifer.wright@exprealty.net",
    },
  ],
  mentorParticipation: "Mentor",
  isPartnerAgent: false,
};

export interface SidebarNavItem {
  title: string;
  icon: string;
  url?: string;
  submenu?: { title: string; url: string }[];
}

export interface SidebarSection {
  label: string;
  items: SidebarNavItem[];
}

export const sidebarNavigation: Record<string, SidebarSection> = {
  myDesk: {
    label: "MY DESK",
    items: [
      { title: "Home", icon: "Home", url: "/" },
      {
        title: "Agent",
        icon: "User",
        url: "/agent/dashboard",
        submenu: [
          { title: "Dashboard", url: "/agent/dashboard" },
          { title: "Agent Production Details", url: "/agent/transactions" },
          { title: "ICON Program", url: "/agent/icon-program" },
          { title: "Broker Hub", url: "/agent/broker-hub" },
          { title: "Custom Service Fees", url: "/agent/custom-service-fees" },
        ],
      },
      {
        title: "Documents",
        icon: "FileText",
        url: "/documents/portal",
        submenu: [
          { title: "Year-End", url: "/documents/year-end" },
          { title: "Downloads", url: "/documents/downloads" },
          { title: "Documents Portal", url: "/documents/portal" },
        ],
      },
      { title: "Events Calendar", icon: "Calendar", url: "/events" },
    ],
  },
  businessGrowth: {
    label: "BUSINESS & GROWTH",
    items: [
      {
        title: "Team",
        icon: "Users",
        url: "/team/dashboard",
        submenu: [
          { title: "Dashboard", url: "/team/dashboard" },
          { title: "Team Reconciliation", url: "/team/reconciliation" },
        ],
      },
      {
        title: "RevShare Earnings",
        icon: "DollarSign",
        url: "/revshare/dashboard",
        submenu: [
          { title: "Dashboard", url: "/revshare/dashboard" },
          { title: "Organization", url: "/revshare/organization" },
          { title: "Organization Tree", url: "/revshare/organization-tree" },
          { title: "My RevShare Trends", url: "/revshare/trends" },
          { title: "Revenue Share Group", url: "/revshare/group" },
          { title: "Financials", url: "/revshare/financials" },
        ],
      },
      { title: "Mentor Program", icon: "GraduationCap", url: "/mentor" },
    ],
  },
  resources: {
    label: "RESOURCES",
    items: [
      
      { title: "Tools", icon: "Wrench", url: "/tools" },
      { title: "Knowledge Base", icon: "BookOpen", url: "/knowledge" },
      { title: "Help Center", icon: "HelpCircle", url: "/help" },
    ],
  },
};

export const navItems = [
  {
    title: "Agent",
    icon: "User",
    url: "/agent/dashboard",
  },
  {
    title: "Team",
    icon: "Users",
    url: "/team/dashboard",
    hasSubmenu: true,
    submenu: [
      { title: "Dashboard", url: "/team/dashboard" },
      { title: "Team Reconciliation", url: "/team/reconciliation" },
    ],
  },
  {
    title: "RevShare Earnings",
    icon: "DollarSign",
    hasSubmenu: true,
    submenu: [
      { title: "Dashboard", url: "/revshare/dashboard" },
      { title: "Organization", url: "/revshare/organization" },
      { title: "Organization Tree", url: "/revshare/organization-tree" },
      { title: "My RevShare Trends", url: "/revshare/trends" },
      { title: "Revenue Share Group", url: "/revshare/group" },
      { title: "Financials", url: "/revshare/financials" },
    ],
  },
  {
    title: "Pulse",
    icon: "Sparkles",
    url: "/pulse",
  },
  {
    title: "Documents",
    icon: "FileText",
    hasSubmenu: true,
    submenu: [
      { title: "Year-End", url: "/documents/year-end" },
      { title: "Downloads", url: "/documents/downloads" },
      { title: "Documents Portal", url: "/documents/portal" },
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
