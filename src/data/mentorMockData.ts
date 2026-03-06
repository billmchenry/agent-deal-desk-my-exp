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
    phone: "(916) 555-4892",
    city: "Sacramento",
    state: "CA",
    postalCode: "95814",
    country: "United States",
    secondaryEmail: "mercy.lf@gmail.com",
    sponsor: { name: "David Hernandez", email: "david.hernandez@exprealty.com", phone: "(916) 555-1039" },
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
    phone: "(512) 555-7834",
    city: "Austin",
    state: "TX",
    postalCode: "78701",
    country: "United States",
    secondaryEmail: "",
    sponsor: { name: "Patricia Young", email: "patricia.young@exprealty.com", phone: "(503) 555-5510" },
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
    phone: "(303) 555-3021",
    city: "Denver",
    state: "CO",
    postalCode: "80202",
    country: "United States",
    secondaryEmail: "priya.s@outlook.com",
    sponsor: { name: "James Anderson", email: "james.anderson@exprealty.com", phone: "(312) 555-5678" },
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
    phone: "(404) 555-2103",
    city: "Atlanta",
    state: "GA",
    postalCode: "30301",
    country: "United States",
    secondaryEmail: "",
    sponsor: { name: "Marcus Welling", email: "marcus.welling@exprealty.com", phone: "(480) 555-9173" },
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
    phone: "(206) 555-9182",
    city: "Seattle",
    state: "WA",
    postalCode: "98101",
    country: "United States",
    secondaryEmail: "nkim.re@gmail.com",
    sponsor: { name: "Maria Garcia", email: "maria.garcia@exprealty.com", phone: "(305) 555-7890" },
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
    phone: "(305) 555-0193",
    city: "Miami",
    state: "FL",
    postalCode: "33101",
    country: "United States",
    secondaryEmail: "",
    sponsor: { name: "David Williams", email: "david.williams@exprealty.com", phone: "(214) 555-6789" },
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
    phone: "(312) 555-7654",
    city: "Chicago",
    state: "IL",
    postalCode: "60601",
    country: "United States",
    secondaryEmail: "j.mitchell@yahoo.com",
    sponsor: { name: "Patricia Young", email: "patricia.young@exprealty.com", phone: "(503) 555-5510" },
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
    phone: "(602) 555-4420",
    city: "Phoenix",
    state: "AZ",
    postalCode: "85001",
    country: "United States",
    secondaryEmail: "aisha.p@hotmail.com",
    sponsor: { name: "James Anderson", email: "james.anderson@exprealty.com", phone: "(312) 555-5678" },
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
    phone: "(503) 555-8830",
    city: "Portland",
    state: "OR",
    postalCode: "97201",
    country: "United States",
    secondaryEmail: "",
    sponsor: { name: "Marcus Welling", email: "marcus.welling@exprealty.com", phone: "(480) 555-9173" },
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
    phone: "(415) 555-5543",
    city: "San Francisco",
    state: "CA",
    postalCode: "94102",
    country: "United States",
    secondaryEmail: "lisa.chang.re@gmail.com",
    sponsor: { name: "Maria Garcia", email: "maria.garcia@exprealty.com", phone: "(305) 555-7890" },
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
    phone: "(615) 555-1294",
    city: "Nashville",
    state: "TN",
    postalCode: "37201",
    country: "United States",
    secondaryEmail: "",
    sponsor: { name: "David Hernandez", email: "david.hernandez@exprealty.com", phone: "(916) 555-1039" },
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
    phone: "(702) 555-9087",
    city: "Las Vegas",
    state: "NV",
    postalCode: "89101",
    country: "United States",
    secondaryEmail: "r.nguyen@outlook.com",
    sponsor: { name: "Patricia Young", email: "patricia.young@exprealty.com", phone: "(503) 555-5510" },
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
    phone: "(214) 555-4592",
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

// ── Available Mentors (for mentee "Choose a Mentor" flow) ──

export interface AvailableMentor {
  id: string;
  name: string;
  location: string;
  avatarUrl?: string;
  badges: string[];
  bio: string;
  locationsServiced: string[];
  licenses: { state: string; number: string }[];
  languages: string[];
  mls: string[];
  specializations: string[];
  certifications: string[];
  phone: string;
  email: string;
  facebook?: string;
  linkedin?: string;
  website?: string;
}

// ── State Mentors (for Broker Hub) ──

export interface StateMentor {
  id: string;
  name: string;
  totalActiveMentees: number;
  primaryEmail: string;
  phone: string;
  secondaryEmail: string;
  city: string;
  state: string;
  postalCode: string;
  // Profile fields (reuse AvailableMentor shape)
  avatarUrl?: string;
  bio: string;
  locationsServiced: string[];
  licenses: { state: string; number: string }[];
  languages: string[];
  mls: string[];
  specializations: string[];
  certifications: string[];
  facebook?: string;
  linkedin?: string;
  website?: string;
  // References to mockMentees by id
  menteeIds: string[];
}

export const mockStateMentors: StateMentor[] = [
  {
    id: "sm1",
    name: "Alejandra Pino Torrealba",
    totalActiveMentees: 3,
    primaryEmail: "alejandra.pino@exprealty.com",
    phone: "(555) 293-4810",
    secondaryEmail: "apino@gmail.com",
    city: "Katy",
    state: "TX",
    postalCode: "77494",
    bio: "With over 15 years of real estate experience across both residential and commercial markets, I am passionate about helping new agents find their footing.",
    locationsServiced: ["Houston", "Katy", "Sugar Land", "Richmond"],
    licenses: [{ state: "TX", number: "TX-782341" }],
    languages: ["English", "Spanish"],
    mls: ["HAR MLS", "Houston MLS"],
    specializations: ["Residential", "Luxury", "First-Time Buyers"],
    certifications: ["ABR", "CRS", "GRI"],
    facebook: "https://facebook.com/alejandrapino",
    linkedin: "https://linkedin.com/in/alejandrapino",
    website: "https://alejandrapino.exprealty.com",
    menteeIds: ["m1", "m2", "m3"],
  },
  {
    id: "sm2",
    name: "Michael Chen",
    totalActiveMentees: 2,
    primaryEmail: "michael.chen@exprealty.com",
    phone: "(555) 482-1930",
    secondaryEmail: "",
    city: "Sacramento",
    state: "CA",
    postalCode: "95814",
    bio: "I specialize in guiding new agents through the Sacramento and Northern California markets. Having closed over 200 transactions in the past decade.",
    locationsServiced: ["Sacramento", "Elk Grove", "Roseville", "Folsom"],
    licenses: [{ state: "CA", number: "CA-019283" }],
    languages: ["English", "Mandarin"],
    mls: ["MetroList MLS"],
    specializations: ["Residential", "Investment Properties"],
    certifications: ["CRS", "SRS"],
    linkedin: "https://linkedin.com/in/michaelchenre",
    menteeIds: ["m5", "m10"],
  },
  {
    id: "sm3",
    name: "Sarah Blackwood",
    totalActiveMentees: 2,
    primaryEmail: "sarah.blackwood@exprealty.com",
    phone: "(555) 771-3204",
    secondaryEmail: "sblackwood@outlook.com",
    city: "Nashville",
    state: "TN",
    postalCode: "37201",
    bio: "As a top-producing agent in the Nashville metro area, I bring a deep understanding of market trends and client service excellence.",
    locationsServiced: ["Nashville", "Franklin", "Brentwood", "Murfreesboro"],
    licenses: [{ state: "TN", number: "TN-445901" }],
    languages: ["English"],
    mls: ["Realtracs MLS"],
    specializations: ["Residential", "Relocation"],
    certifications: ["ABR", "e-PRO"],
    website: "https://sarahblackwood.exprealty.com",
    menteeIds: ["m7", "m11"],
  },
  {
    id: "sm4",
    name: "David Okonkwo",
    totalActiveMentees: 2,
    primaryEmail: "david.okonkwo@exprealty.com",
    phone: "(555) 618-9042",
    secondaryEmail: "",
    city: "Atlanta",
    state: "GA",
    postalCode: "30301",
    bio: "I have been in the real estate industry for over 20 years and have mentored dozens of successful agents.",
    locationsServiced: ["Atlanta", "Decatur", "Marietta", "Alpharetta"],
    licenses: [{ state: "GA", number: "GA-338102" }],
    languages: ["English", "French"],
    mls: ["FMLS", "Georgia MLS"],
    specializations: ["Luxury", "New Construction", "Investment"],
    certifications: ["CRS", "GRI", "CLHMS"],
    facebook: "https://facebook.com/davidokonkworealty",
    linkedin: "https://linkedin.com/in/davidokonkwo",
    menteeIds: ["m4", "m8"],
  },
  {
    id: "sm5",
    name: "Patricia Young",
    totalActiveMentees: 1,
    primaryEmail: "patricia.young@exprealty.com",
    phone: "(555) 293-5510",
    secondaryEmail: "pyoung.re@gmail.com",
    city: "Portland",
    state: "OR",
    postalCode: "97201",
    bio: "Focused on sustainable real estate practices and community-driven development in the Pacific Northwest.",
    locationsServiced: ["Portland", "Beaverton", "Lake Oswego"],
    licenses: [{ state: "OR", number: "OR-220194" }],
    languages: ["English"],
    mls: ["RMLS"],
    specializations: ["Residential", "Green Homes"],
    certifications: ["GREEN", "ABR"],
    menteeIds: ["m9"],
  },
  {
    id: "sm6",
    name: "Roberto Delgado",
    totalActiveMentees: 1,
    primaryEmail: "roberto.delgado@exprealty.com",
    phone: "(555) 340-8821",
    secondaryEmail: "",
    city: "Miami",
    state: "FL",
    postalCode: "33101",
    bio: "Bilingual mentor specializing in South Florida luxury and international markets.",
    locationsServiced: ["Miami", "Fort Lauderdale", "Coral Gables"],
    licenses: [{ state: "FL", number: "FL-990832" }],
    languages: ["English", "Spanish", "Portuguese"],
    mls: ["Miami MLS", "BeachesMLS"],
    specializations: ["Luxury", "International"],
    certifications: ["CIPS", "CRS"],
    linkedin: "https://linkedin.com/in/robertodelgado",
    menteeIds: ["m6"],
  },
  {
    id: "sm7",
    name: "Jennifer Walsh",
    totalActiveMentees: 1,
    primaryEmail: "jennifer.walsh@exprealty.com",
    phone: "(555) 567-8901",
    secondaryEmail: "jwalsh@yahoo.com",
    city: "Las Vegas",
    state: "NV",
    postalCode: "89101",
    bio: "Helping new agents build their dream careers in the Las Vegas and Henderson real estate markets.",
    locationsServiced: ["Las Vegas", "Henderson", "Summerlin"],
    licenses: [{ state: "NV", number: "NV-112039" }],
    languages: ["English"],
    mls: ["Las Vegas MLS"],
    specializations: ["Residential", "Investment Properties"],
    certifications: ["SRS", "ABR"],
    menteeIds: ["m12"],
  },
  {
    id: "sm8",
    name: "Tomoko Hayashi",
    totalActiveMentees: 0,
    primaryEmail: "tomoko.hayashi@exprealty.com",
    phone: "(555) 801-2293",
    secondaryEmail: "thayashi@gmail.com",
    city: "Seattle",
    state: "WA",
    postalCode: "98101",
    bio: "Multilingual agent serving the diverse Seattle metro communities with cultural sensitivity and expertise.",
    locationsServiced: ["Seattle", "Bellevue", "Redmond", "Kirkland"],
    licenses: [{ state: "WA", number: "WA-554012" }],
    languages: ["English", "Japanese"],
    mls: ["NWMLS"],
    specializations: ["Residential", "Relocation"],
    certifications: ["CRS", "e-PRO"],
    linkedin: "https://linkedin.com/in/tomokohayashi",
    menteeIds: [],
  },
  {
    id: "sm9",
    name: "Anthony Russo",
    totalActiveMentees: 0,
    primaryEmail: "anthony.russo@exprealty.com",
    phone: "(555) 419-6783",
    secondaryEmail: "",
    city: "Phoenix",
    state: "AZ",
    postalCode: "85001",
    bio: "20+ year veteran of the Arizona real estate market. Ready to mentor the next generation of top producers.",
    locationsServiced: ["Phoenix", "Scottsdale", "Tempe", "Mesa"],
    licenses: [{ state: "AZ", number: "AZ-882014" }],
    languages: ["English", "Italian"],
    mls: ["Arizona MLS"],
    specializations: ["Residential", "Luxury", "New Construction"],
    certifications: ["GRI", "CLHMS"],
    facebook: "https://facebook.com/anthonyrusso",
    menteeIds: [],
  },
  {
    id: "sm10",
    name: "Diana Osei-Mensah",
    totalActiveMentees: 0,
    primaryEmail: "diana.osm@exprealty.com",
    phone: "(555) 662-1045",
    secondaryEmail: "diana.osm@outlook.com",
    city: "Dallas",
    state: "TX",
    postalCode: "75201",
    bio: "Passionate about diversity in real estate and committed to mentoring agents from all backgrounds.",
    locationsServiced: ["Dallas", "Fort Worth", "Plano", "Frisco"],
    licenses: [{ state: "TX", number: "TX-443092" }],
    languages: ["English", "French", "Twi"],
    mls: ["North Texas MLS"],
    specializations: ["Residential", "First-Time Buyers"],
    certifications: ["ABR", "SRS"],
    linkedin: "https://linkedin.com/in/dianaosei",
    menteeIds: [],
  },
];

export const mockAvailableMentors: AvailableMentor[] = [
  {
    id: "am1",
    name: "Alejandra Pino Torrealba",
    location: "Katy, TX",
    badges: ["Team Lead", "ICON"],
    bio: "With over 15 years of real estate experience across both residential and commercial markets, I am passionate about helping new agents find their footing and build sustainable businesses. My approach combines hands-on transaction support with strategic business planning to ensure mentees not only close their first deals but develop the skills and confidence to thrive long-term in this industry.",
    locationsServiced: ["Houston", "Katy", "Sugar Land", "Richmond", "Cypress"],
    licenses: [{ state: "TX", number: "TX-782341" }],
    languages: ["English", "Spanish"],
    mls: ["HAR MLS", "Houston MLS"],
    specializations: ["Residential", "Luxury", "First-Time Buyers"],
    certifications: ["ABR", "CRS", "GRI"],
    phone: "(555) 293-4810",
    email: "alejandra.pino@exprealty.com",
    facebook: "https://facebook.com/alejandrapino",
    linkedin: "https://linkedin.com/in/alejandrapino",
    website: "https://alejandrapino.exprealty.com",
  },
  {
    id: "am2",
    name: "Michael Chen",
    location: "Sacramento, CA",
    badges: ["ICON", "On a Team"],
    bio: "I specialize in guiding new agents through the Sacramento and Northern California markets. Having closed over 200 transactions in the past decade, I understand the nuances of diverse neighborhoods and property types. My mentorship style focuses on building strong client relationships and mastering negotiation tactics.",
    locationsServiced: ["Sacramento", "Elk Grove", "Roseville", "Folsom"],
    licenses: [{ state: "CA", number: "CA-019283" }],
    languages: ["English", "Mandarin"],
    mls: ["MetroList MLS"],
    specializations: ["Residential", "Investment Properties"],
    certifications: ["CRS", "SRS"],
    phone: "(555) 482-1930",
    email: "michael.chen@exprealty.com",
    linkedin: "https://linkedin.com/in/michaelchenre",
  },
  {
    id: "am3",
    name: "Sarah Blackwood",
    location: "Nashville, TN",
    badges: ["Team Lead"],
    bio: "As a top-producing agent in the Nashville metro area, I bring a deep understanding of market trends and client service excellence. I believe every new agent deserves a mentor who is accessible, patient, and invested in their success. My door is always open for questions, role-play sessions, and deal reviews.",
    locationsServiced: ["Nashville", "Franklin", "Brentwood", "Murfreesboro"],
    licenses: [{ state: "TN", number: "TN-445901" }],
    languages: ["English"],
    mls: ["Realtracs MLS"],
    specializations: ["Residential", "Relocation"],
    certifications: ["ABR", "e-PRO"],
    phone: "(555) 771-3204",
    email: "sarah.blackwood@exprealty.com",
    website: "https://sarahblackwood.exprealty.com",
  },
  {
    id: "am4",
    name: "David Okonkwo",
    location: "Atlanta, GA",
    badges: ["ICON", "Team Lead", "On a Team"],
    bio: "I have been in the real estate industry for over 20 years and have mentored dozens of successful agents. My expertise spans luxury homes, new construction, and investment properties across the greater Atlanta area. I take a structured approach to mentorship with weekly check-ins and goal tracking.",
    locationsServiced: ["Atlanta", "Decatur", "Marietta", "Alpharetta", "Buckhead"],
    licenses: [{ state: "GA", number: "GA-338102" }],
    languages: ["English", "French"],
    mls: ["FMLS", "Georgia MLS"],
    specializations: ["Luxury", "New Construction", "Investment"],
    certifications: ["CRS", "GRI", "CLHMS"],
    phone: "(555) 618-9042",
    email: "david.okonkwo@exprealty.com",
    facebook: "https://facebook.com/davidokonkworealty",
    linkedin: "https://linkedin.com/in/davidokonkwo",
  },
];
