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

export const navItems = [
  {
    title: "Agent",
    icon: "User",
    hasSubmenu: true,
    submenu: [
      { title: "Dashboard", url: "/agent/dashboard" },
      { title: "ICON Program", url: "/agent/icon-program" },
    ],
  },
  {
    title: "Team",
    icon: "Users",
    url: "/team/dashboard",
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
