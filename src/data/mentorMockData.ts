// Mock data for Mentor Program - Active Mentor scenario

export interface MenteeTransaction {
  id: string;
  address: string;
  dateEntered: string;
  source: string;
  transactionNumber: string;
  status: string;
  propertyType: string;
  saleType: string;
  actualCloseDate: string;
  mentorFee: number;
  salePrice: number;
  gci: number;
  companyCommission: number;
}

export interface MenteeSponsor {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface Mentee {
  id: string;
  agentName: string;
  status: string;
  agentId: string;
  joinDate: string;
  transactionsRemaining: number;
  paidMentorFees: number;
  mentorFee: number;
  email: string;
  phone: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  secondaryEmail: string;
  sponsor: MenteeSponsor;
  avatarUrl?: string;
  transactions: MenteeTransaction[];
}

export interface MentorRequestDetail {
  id: string;
  firstName: string;
  lastName: string;
  requestSentDate: string;
  status: string;
  primaryEmail: string;
  secondaryEmail: string;
  phone: string;
  city: string;
  state: string;
  sponsorName: string;
  region: string;
  team: string;
  avatarUrl?: string;
  mlsList: { name: string; id: string; state: string }[];
  activeMarkets: { market: string; state: string }[];
}

export const mockMentees: Mentee[] = [
  {
    id: "m1",
    agentName: "Mercy Le Fevre",
    status: "Active",
    agentId: "AGT-90421",
    joinDate: "2024-11-15",
    transactionsRemaining: 3,
    paidMentorFees: 0,
    mentorFee: 25,
    email: "mercy.lefevre@exprealty.com",
    phone: "(555) 301-4892",
    city: "Sacramento",
    state: "CA",
    postalCode: "95814",
    country: "United States",
    secondaryEmail: "mercy.lf@gmail.com",
    sponsor: { name: "David Hernandez", email: "david.hernandez@exprealty.com", phone: "(555) 482-1039" },
    transactions: [
      {
        id: "t1",
        address: "1234 Elm Street, Sacramento, CA 95814",
        dateEntered: "2025-01-10",
        source: "Buyer",
        transactionNumber: "TXN-2025-00412",
        status: "Pending",
        propertyType: "Single Family",
        saleType: "Resale",
        actualCloseDate: "2025-03-15",
        mentorFee: 1250,
        salePrice: 425000,
        gci: 12750,
        companyCommission: 5100,
      },
    ],
  },
  {
    id: "m2",
    agentName: "Carlos Rivera",
    status: "Active",
    agentId: "AGT-90533",
    joinDate: "2024-09-03",
    transactionsRemaining: 2,
    paidMentorFees: 1875,
    mentorFee: 25,
    email: "carlos.rivera@exprealty.com",
    phone: "(555) 612-7834",
    city: "Austin",
    state: "TX",
    postalCode: "78701",
    country: "United States",
    secondaryEmail: "",
    sponsor: { name: "Patricia Young", email: "patricia.young@exprealty.com", phone: "(555) 293-5510" },
    transactions: [
      {
        id: "t2",
        address: "5678 Oak Avenue, Austin, TX 78701",
        dateEntered: "2024-12-05",
        source: "Seller",
        transactionNumber: "TXN-2024-08921",
        status: "Closed",
        propertyType: "Condo",
        saleType: "Resale",
        actualCloseDate: "2025-01-28",
        mentorFee: 1875,
        salePrice: 375000,
        gci: 11250,
        companyCommission: 4500,
      },
    ],
  },
  {
    id: "m3",
    agentName: "Priya Sharma",
    status: "Active",
    agentId: "AGT-90687",
    joinDate: "2025-01-12",
    transactionsRemaining: 3,
    paidMentorFees: 0,
    mentorFee: 20,
    email: "priya.sharma@exprealty.com",
    phone: "(555) 149-3021",
    city: "Denver",
    state: "CO",
    postalCode: "80202",
    country: "United States",
    secondaryEmail: "priya.s@outlook.com",
    sponsor: { name: "James Anderson", email: "james.anderson@exprealty.com", phone: "(555) 234-5678" },
    transactions: [],
  },
  {
    id: "m4",
    agentName: "Tamika Johnson",
    status: "Active",
    agentId: "AGT-90745",
    joinDate: "2024-08-20",
    transactionsRemaining: 1,
    paidMentorFees: 3200,
    mentorFee: 25,
    email: "tamika.johnson@exprealty.com",
    phone: "(555) 887-2103",
    city: "Atlanta",
    state: "GA",
    postalCode: "30301",
    country: "United States",
    secondaryEmail: "",
    sponsor: { name: "Robert Conat", email: "robert.conat@exprealty.com", phone: "(555) 482-9173" },
    transactions: [
      {
        id: "t3",
        address: "910 Peachtree Blvd, Atlanta, GA 30301",
        dateEntered: "2024-10-12",
        source: "Buyer",
        transactionNumber: "TXN-2024-07234",
        status: "Closed",
        propertyType: "Townhouse",
        saleType: "Resale",
        actualCloseDate: "2024-12-18",
        mentorFee: 1600,
        salePrice: 320000,
        gci: 9600,
        companyCommission: 3840,
      },
      {
        id: "t4",
        address: "445 Magnolia Lane, Atlanta, GA 30308",
        dateEntered: "2025-01-03",
        source: "Seller",
        transactionNumber: "TXN-2025-00198",
        status: "Closed",
        propertyType: "Single Family",
        saleType: "Resale",
        actualCloseDate: "2025-02-20",
        mentorFee: 1600,
        salePrice: 385000,
        gci: 11550,
        companyCommission: 4620,
      },
    ],
  },
  {
    id: "m5",
    agentName: "Nathan Kim",
    status: "Active",
    agentId: "AGT-90812",
    joinDate: "2024-10-01",
    transactionsRemaining: 2,
    paidMentorFees: 950,
    mentorFee: 20,
    email: "nathan.kim@exprealty.com",
    phone: "(555) 503-9182",
    city: "Seattle",
    state: "WA",
    postalCode: "98101",
    country: "United States",
    secondaryEmail: "nkim.re@gmail.com",
    sponsor: { name: "Maria Garcia", email: "maria.garcia@exprealty.com", phone: "(555) 456-7890" },
    transactions: [
      {
        id: "t5",
        address: "2200 Pine Street, Seattle, WA 98101",
        dateEntered: "2025-02-01",
        source: "Buyer",
        transactionNumber: "TXN-2025-01050",
        status: "Pending",
        propertyType: "Condo",
        saleType: "New Construction",
        actualCloseDate: "2025-04-10",
        mentorFee: 950,
        salePrice: 520000,
        gci: 15600,
        companyCommission: 6240,
      },
    ],
  },
  {
    id: "m6",
    agentName: "Elena Vasquez",
    status: "Inactive",
    agentId: "AGT-90299",
    joinDate: "2024-06-15",
    transactionsRemaining: 3,
    paidMentorFees: 0,
    mentorFee: 25,
    email: "elena.vasquez@exprealty.com",
    phone: "(555) 742-0193",
    city: "Miami",
    state: "FL",
    postalCode: "33101",
    country: "United States",
    secondaryEmail: "",
    sponsor: { name: "David Williams", email: "david.williams@exprealty.com", phone: "(555) 345-6789" },
    transactions: [],
  },
  {
    id: "m7",
    agentName: "Jordan Mitchell",
    status: "Active",
    agentId: "AGT-90955",
    joinDate: "2025-02-01",
    transactionsRemaining: 3,
    paidMentorFees: 0,
    mentorFee: 20,
    email: "jordan.mitchell@exprealty.com",
    phone: "(555) 321-7654",
    city: "Chicago",
    state: "IL",
    postalCode: "60601",
    country: "United States",
    secondaryEmail: "j.mitchell@yahoo.com",
    sponsor: { name: "Patricia Young", email: "patricia.young@exprealty.com", phone: "(555) 293-5510" },
    transactions: [],
  },
  {
    id: "m8",
    agentName: "Aisha Patel",
    status: "Active",
    agentId: "AGT-90401",
    joinDate: "2024-07-22",
    transactionsRemaining: 0,
    paidMentorFees: 4500,
    mentorFee: 25,
    email: "aisha.patel@exprealty.com",
    phone: "(555) 918-4420",
    city: "Phoenix",
    state: "AZ",
    postalCode: "85001",
    country: "United States",
    secondaryEmail: "aisha.p@hotmail.com",
    sponsor: { name: "James Anderson", email: "james.anderson@exprealty.com", phone: "(555) 234-5678" },
    transactions: [
      {
        id: "t6",
        address: "789 Desert Rose Dr, Phoenix, AZ 85001",
        dateEntered: "2024-09-10",
        source: "Buyer",
        transactionNumber: "TXN-2024-06891",
        status: "Closed",
        propertyType: "Single Family",
        saleType: "Resale",
        actualCloseDate: "2024-11-05",
        mentorFee: 1500,
        salePrice: 290000,
        gci: 8700,
        companyCommission: 3480,
      },
      {
        id: "t7",
        address: "320 Cactus Way, Scottsdale, AZ 85251",
        dateEntered: "2024-11-20",
        source: "Seller",
        transactionNumber: "TXN-2024-09102",
        status: "Closed",
        propertyType: "Condo",
        saleType: "Resale",
        actualCloseDate: "2025-01-15",
        mentorFee: 1500,
        salePrice: 340000,
        gci: 10200,
        companyCommission: 4080,
      },
      {
        id: "t8",
        address: "1500 Saguaro Blvd, Tempe, AZ 85281",
        dateEntered: "2025-01-25",
        source: "Buyer",
        transactionNumber: "TXN-2025-00789",
        status: "Closed",
        propertyType: "Townhouse",
        saleType: "Resale",
        actualCloseDate: "2025-02-28",
        mentorFee: 1500,
        salePrice: 310000,
        gci: 9300,
        companyCommission: 3720,
      },
    ],
  },
  {
    id: "m9",
    agentName: "Brian O'Sullivan",
    status: "Active",
    agentId: "AGT-91023",
    joinDate: "2024-12-10",
    transactionsRemaining: 3,
    paidMentorFees: 0,
    mentorFee: 20,
    email: "brian.osullivan@exprealty.com",
    phone: "(555) 614-8830",
    city: "Portland",
    state: "OR",
    postalCode: "97201",
    country: "United States",
    secondaryEmail: "",
    sponsor: { name: "Robert Conat", email: "robert.conat@exprealty.com", phone: "(555) 482-9173" },
    transactions: [],
  },
  {
    id: "m10",
    agentName: "Lisa Chang",
    status: "Active",
    agentId: "AGT-91100",
    joinDate: "2024-11-01",
    transactionsRemaining: 2,
    paidMentorFees: 1100,
    mentorFee: 20,
    email: "lisa.chang@exprealty.com",
    phone: "(555) 220-5543",
    city: "San Francisco",
    state: "CA",
    postalCode: "94102",
    country: "United States",
    secondaryEmail: "lisa.chang.re@gmail.com",
    sponsor: { name: "Maria Garcia", email: "maria.garcia@exprealty.com", phone: "(555) 456-7890" },
    transactions: [
      {
        id: "t9",
        address: "88 Market Street, San Francisco, CA 94102",
        dateEntered: "2025-02-10",
        source: "Buyer",
        transactionNumber: "TXN-2025-01230",
        status: "Pending",
        propertyType: "Condo",
        saleType: "Resale",
        actualCloseDate: "2025-04-20",
        mentorFee: 1100,
        salePrice: 680000,
        gci: 20400,
        companyCommission: 8160,
      },
    ],
  },
  {
    id: "m11",
    agentName: "Derek Washington",
    status: "Active",
    agentId: "AGT-91205",
    joinDate: "2025-01-20",
    transactionsRemaining: 3,
    paidMentorFees: 0,
    mentorFee: 25,
    email: "derek.washington@exprealty.com",
    phone: "(555) 773-1294",
    city: "Nashville",
    state: "TN",
    postalCode: "37201",
    country: "United States",
    secondaryEmail: "",
    sponsor: { name: "David Hernandez", email: "david.hernandez@exprealty.com", phone: "(555) 482-1039" },
    transactions: [],
  },
  {
    id: "m12",
    agentName: "Rachel Nguyen",
    status: "Active",
    agentId: "AGT-91310",
    joinDate: "2024-10-15",
    transactionsRemaining: 1,
    paidMentorFees: 2800,
    mentorFee: 20,
    email: "rachel.nguyen@exprealty.com",
    phone: "(555) 445-9087",
    city: "Las Vegas",
    state: "NV",
    postalCode: "89101",
    country: "United States",
    secondaryEmail: "r.nguyen@outlook.com",
    sponsor: { name: "Patricia Young", email: "patricia.young@exprealty.com", phone: "(555) 293-5510" },
    transactions: [
      {
        id: "t10",
        address: "4400 Paradise Rd, Las Vegas, NV 89101",
        dateEntered: "2024-11-18",
        source: "Seller",
        transactionNumber: "TXN-2024-09455",
        status: "Closed",
        propertyType: "Single Family",
        saleType: "Resale",
        actualCloseDate: "2025-01-10",
        mentorFee: 1400,
        salePrice: 350000,
        gci: 10500,
        companyCommission: 4200,
      },
      {
        id: "t11",
        address: "2100 Flamingo Way, Las Vegas, NV 89109",
        dateEntered: "2025-02-05",
        source: "Buyer",
        transactionNumber: "TXN-2025-01100",
        status: "Pending",
        propertyType: "Condo",
        saleType: "Resale",
        actualCloseDate: "2025-04-01",
        mentorFee: 1400,
        salePrice: 280000,
        gci: 8400,
        companyCommission: 3360,
      },
    ],
  },
];

export const mockMentorRequests: MentorRequestDetail[] = [
  {
    id: "req1",
    firstName: "Samantha",
    lastName: "Reeves",
    requestSentDate: "2025-02-28",
    status: "Active",
    primaryEmail: "samantha.reeves@exprealty.com",
    secondaryEmail: "sam.reeves@gmail.com",
    phone: "(555) 310-4592",
    city: "Dallas",
    state: "TX",
    sponsorName: "James Anderson",
    region: "South Central",
    team: "Lone Star Group",
    mlsList: [
      { name: "North Texas MLS", id: "NTREIS-89201", state: "TX" },
    ],
    activeMarkets: [
      { market: "Dallas-Fort Worth", state: "TX" },
      { market: "Plano", state: "TX" },
    ],
  },
  {
    id: "req2",
    firstName: "Marcus",
    lastName: "Okafor",
    requestSentDate: "2025-03-01",
    status: "Active",
    primaryEmail: "marcus.okafor@exprealty.com",
    secondaryEmail: "",
    phone: "(555) 892-1034",
    city: "Charlotte",
    state: "NC",
    sponsorName: "Maria Garcia",
    region: "Southeast",
    team: "Queen City Realty",
    mlsList: [
      { name: "Canopy MLS", id: "CRMLS-44210", state: "NC" },
      { name: "Triad MLS", id: "TMLS-33102", state: "NC" },
    ],
    activeMarkets: [
      { market: "Charlotte Metro", state: "NC" },
      { market: "Concord", state: "NC" },
      { market: "Huntersville", state: "NC" },
    ],
  },
];
