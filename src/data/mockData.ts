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
    phone: "(312) 555-5678",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    level: 1,
    isContributor: true,
  },
  {
    id: "3",
    name: "David Williams",
    email: "david.williams@exp.com",
    phone: "(214) 555-6789",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    level: 2,
    isContributor: true,
  },
  {
    id: "4",
    name: "Maria Garcia",
    email: "maria.garcia@exp.com",
    phone: "(305) 555-7890",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    level: 3,
    isContributor: true,
  },
  {
    id: "5",
    name: "Sarah Johnson",
    email: "sarah.johnson@exp.com",
    phone: "(480) 555-8901",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    level: 4,
    isContributor: true,
  },
  {
    id: "6",
    name: "Robert Martinez",
    email: "robert.martinez@exp.com",
    phone: "(702) 555-9012",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    level: 5,
    isContributor: true,
  },
  {
    id: "7",
    name: "Emily Davis",
    email: "emily.davis@exp.com",
    phone: "(503) 555-0123",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    level: 6,
    isContributor: false,
  },
];

export const cappingData = {
  status: "Uncapped",
  current: 8000,
  target: 16000,
  units: 15,
  gci: 26700,
  volume: 5340000,
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
  { id: "ta1", name: "Rachel Morrison", initials: "RM", rank: "1 of 30", units: 18, volume: 7450000, commission: 223500, uuid: "a1b2c3d4-e5f6-11ec-8d9e-abcdef123456", currency: "USD" },
  { id: "ta2", name: "Daniel Crawford", initials: "DC", rank: "2 of 30", units: 15, volume: 5890000, commission: 176700, uuid: "b2c3d4e5-f6a7-11ec-9e0f-bcdef1234567", currency: "USD" },
  { id: "ta3", name: "Amanda Chen-Rodriguez", initials: "AC", rank: "3 of 30", units: 14, volume: 5520000, commission: 165600, uuid: "c3d4e5f6-a7b8-11ec-0f1a-cdef12345678", currency: "USD" },
  { id: "ta4", name: "Marcus Anthony Blake", initials: "MB", rank: "4 of 30", units: 12, volume: 4150000, commission: 124500, uuid: "d4e5f6a7-b8c9-11ec-1a2b-def123456789", currency: "USD" },
  { id: "ta5", name: "Jennifer Walsh", initials: "JW", rank: "5 of 30", units: 11, volume: 3785000, commission: 113550, uuid: "e5f6a7b8-c9d0-11ec-2b3c-ef1234567890", currency: "USD" },
  { id: "ta6", name: "Thomas Nakamura", initials: "TN", rank: "6 of 30", units: 10, volume: 3620000, commission: 108600, uuid: "f6a7b8c9-d0e1-11ec-3c4d-f01234567891", currency: "USD" },
  { id: "ta7", name: "Sofia Petrova", initials: "SP", rank: "7 of 30", units: 9, volume: 3410000, commission: 102300, uuid: "a7b8c9d0-e1f2-11ec-4d5e-012345678912", currency: "USD" },
  { id: "ta8", name: "Brian O'Sullivan", initials: "BO", rank: "8 of 30", units: 9, volume: 3280000, commission: 98400, uuid: "b8c9d0e1-f2a3-11ec-5e6f-123456789023", currency: "USD" },
  { id: "ta9", name: "Lisa Fernandez", initials: "LF", rank: "9 of 30", units: 8, volume: 2950000, commission: 88500, uuid: "c9d0e1f2-a3b4-11ec-6f7a-234567890134", currency: "USD" },
  { id: "ta10", name: "Kevin Yuen", initials: "KY", rank: "10 of 30", units: 8, volume: 2870000, commission: 86100, uuid: "d0e1f2a3-b4c5-11ec-7a8b-345678901245", currency: "USD" },
  { id: "ta11", name: "Patricia Kowalski", initials: "PK", rank: "11 of 30", units: 7, volume: 2650000, commission: 79500, uuid: "e1f2a3b4-c5d6-11ec-8b9c-456789012356", currency: "USD" },
  { id: "ta12", name: "Nathan Brooks", initials: "NB", rank: "12 of 30", units: 7, volume: 2540000, commission: 76200, uuid: "f2a3b4c5-d6e7-11ec-9c0d-567890123467", currency: "USD" },
  { id: "ta13", name: "Elena Vasquez", initials: "EV", rank: "13 of 30", units: 6, volume: 2380000, commission: 71400, uuid: "a3b4c5d6-e7f8-11ec-0d1e-678901234578", currency: "USD" },
  { id: "ta14", name: "Charles Adeyemi", initials: "CA", rank: "14 of 30", units: 6, volume: 2210000, commission: 66300, uuid: "b4c5d6e7-f8a9-11ec-1e2f-789012345689", currency: "USD" },
  { id: "ta15", name: "Heather Lin", initials: "HL", rank: "15 of 30", units: 5, volume: 2050000, commission: 61500, uuid: "c5d6e7f8-a9b0-11ec-2f3a-890123456790", currency: "USD" },
  { id: "ta16", name: "Ryan Kapoor", initials: "RK", rank: "16 of 30", units: 5, volume: 1920000, commission: 57600, uuid: "d6e7f8a9-b0c1-11ec-3a4b-901234567801", currency: "USD" },
  { id: "ta17", name: "Monica Dubois", initials: "MD", rank: "17 of 30", units: 4, volume: 1780000, commission: 53400, uuid: "e7f8a9b0-c1d2-11ec-4b5c-012345678912", currency: "USD" },
  { id: "ta18", name: "Jason Whitfield", initials: "JWh", rank: "18 of 30", units: 4, volume: 1650000, commission: 49500, uuid: "f8a9b0c1-d2e3-11ec-5c6d-123456789023", currency: "USD" },
  { id: "ta19", name: "Angela Sorensen", initials: "AS", rank: "19 of 30", units: 4, volume: 1510000, commission: 45300, uuid: "a9b0c1d2-e3f4-11ec-6d7e-234567890134", currency: "USD" },
  { id: "ta20", name: "Derek Huang", initials: "DH", rank: "20 of 30", units: 3, volume: 1390000, commission: 41700, uuid: "b0c1d2e3-f4a5-11ec-7e8f-345678901245", currency: "USD" },
  { id: "ta21", name: "Samantha Price", initials: "SPr", rank: "21 of 30", units: 3, volume: 1270000, commission: 38100, uuid: "c1d2e3f4-a5b6-11ec-8f9a-456789012356", currency: "USD" },
  { id: "ta22", name: "Victor Morales", initials: "VM", rank: "22 of 30", units: 3, volume: 1140000, commission: 34200, uuid: "d2e3f4a5-b6c7-11ec-9a0b-567890123467", currency: "USD" },
  { id: "ta23", name: "Christine Okafor", initials: "CO", rank: "23 of 30", units: 2, volume: 980000, commission: 29400, uuid: "e3f4a5b6-c7d8-11ec-0b1c-678901234578", currency: "USD" },
  { id: "ta24", name: "Gregory Tanaka", initials: "GT", rank: "24 of 30", units: 2, volume: 860000, commission: 25800, uuid: "f4a5b6c7-d8e9-11ec-1c2d-789012345689", currency: "USD" },
  { id: "ta25", name: "Isabella Ricci", initials: "IR", rank: "25 of 30", units: 2, volume: 740000, commission: 22200, uuid: "a5b6c7d8-e9f0-11ec-2d3e-890123456790", currency: "USD" },
  { id: "ta26", name: "William Chang", initials: "WC", rank: "26 of 30", units: 1, volume: 620000, commission: 18600, uuid: "b6c7d8e9-f0a1-11ec-3e4f-901234567801", currency: "USD" },
  { id: "ta27", name: "Danielle Foster", initials: "DF", rank: "27 of 30", units: 1, volume: 510000, commission: 15300, uuid: "c7d8e9f0-a1b2-11ec-4f5a-012345678912", currency: "USD" },
  { id: "ta28", name: "Robert Kim", initials: "RKi", rank: "28 of 30", units: 1, volume: 425000, commission: 12750, uuid: "d8e9f0a1-b2c3-11ec-5a6b-123456789023", currency: "USD" },
  { id: "ta29", name: "Megan Johansson", initials: "MJ", rank: "29 of 30", units: 1, volume: 380000, commission: 11400, uuid: "e9f0a1b2-c3d4-11ec-6b7c-234567890134", currency: "USD" },
  { id: "ta30", name: "Howard Patel", initials: "HP", rank: "30 of 30", units: 1, volume: 295000, commission: 8850, uuid: "f0a1b2c3-d4e5-11ec-7c8d-345678901245", currency: "USD" },
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
    id: "ob1", name: "Jordan Waverly", initials: "J", joinDate: "02/09/2026",
    currentStep: "License Transfer", nextStep: "Convert to Active", durationDays: 24, progress: 65,
    phone: "(619) 555-6503", email: "jordan.waverly@email.com", state: "CA", country: "US",
    sponsorName: "", teamId: "318", teamName: "New Vision Realty Group", joinId: "J423652",
  },
  {
    id: "ob2", name: "Quinn Ashford", initials: "Q", joinDate: "11/03/2025",
    currentStep: "License Transfer", nextStep: "Convert to Active", durationDays: 122, progress: 60,
    phone: "(858) 555-0142", email: "quinn.ashford@email.com", state: "CA", country: "US",
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
      { title: "Broker Hub", icon: "Store", url: "/agent/broker-hub" },
      {
        title: "Agent",
        icon: "User",
        url: "/agent/dashboard",
        submenu: [
          { title: "Dashboard", url: "/agent/dashboard" },
          { title: "Agent Production Details", url: "/agent/transactions" },
          { title: "ICON Program", url: "/agent/icon-program" },
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
