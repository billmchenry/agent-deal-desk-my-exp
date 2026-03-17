// Data-only export — the table UI has moved to Transactions.tsx via DataTable

export type Transaction = {
  id: string;
  status: string;
  transactionId: string;
  actualCloseDate: string;
  scheduledCloseDate: string;
  paymentSettledDate: string;
  gciSum: number;
  salesPrice: number;
  transactionType: string;
  currency: string;
  propertyAddress: string;
  isBuyerAgent: string;
  coAgentPercentage: string;
  agentPayablePercentage: string;
  agentNetCommission: number;
  companyCommission: number;
  netPayment: number;
  capPayment: number;
  firstCap: string;
  brokerReviewFee: number;
  transactionCoordinatorFee: number;
  mentorFee: number;
  mentorProgramFee: number;
  statusComp: string;
  commissionPercentage: string;
  endUnits: number;
};

export const transactionsData: Transaction[] = [
  {
    id: "34476557", status: "Paid", transactionId: "34476557",
    actualCloseDate: "01/15/2026", scheduledCloseDate: "01/18/2026",
    paymentSettledDate: "01/18/2026", gciSum: 398.62, salesPrice: 9750.0,
    transactionType: "Sale", currency: "USD",
    propertyAddress: "783 Rice street, watertown, CA, 95605, US",
    isBuyerAgent: "Yes", coAgentPercentage: "10.00%",
    agentPayablePercentage: "80.00%", agentNetCommission: 398.6,
    companyCommission: 286.87, netPayment: 0.03, capPayment: 0.0,
    firstCap: "1.38", brokerReviewFee: 0, transactionCoordinatorFee: 0,
    mentorFee: 0.02, mentorProgramFee: 0.02, statusComp: "19.96",
    commissionPercentage: "80.00%", endUnits: 1,
  },
  {
    id: "20130815", status: "Withdrawn", transactionId: "20130815",
    actualCloseDate: "-", scheduledCloseDate: "01/17/2026",
    paymentSettledDate: "-", gciSum: 0, salesPrice: 495000.0,
    transactionType: "Landlord", currency: "USD",
    propertyAddress: "1842 Sunrise Lane, ELK GROVE, CA 95624, US",
    isBuyerAgent: "False", coAgentPercentage: "0.00%",
    agentPayablePercentage: "80.00%", agentNetCommission: 0,
    companyCommission: 0.01, netPayment: 0, capPayment: 0,
    firstCap: "0.00", brokerReviewFee: 0, transactionCoordinatorFee: 0,
    mentorFee: 0, mentorProgramFee: 0, statusComp: "0.00",
    commissionPercentage: "80.00%", endUnits: 0.75,
  },
  {
    id: "33221081", status: "Withdrawn", transactionId: "33221081",
    actualCloseDate: "-", scheduledCloseDate: "01/09/2026",
    paymentSettledDate: "-", gciSum: 0, salesPrice: 2875000.0,
    transactionType: "Landlord", currency: "USD",
    propertyAddress: "Sacramento, CA 94204, US",
    isBuyerAgent: "False", coAgentPercentage: "0.00%",
    agentPayablePercentage: "80.00%", agentNetCommission: 0,
    companyCommission: 0.01, netPayment: 0, capPayment: 0,
    firstCap: "0.00", brokerReviewFee: 0, transactionCoordinatorFee: 0,
    mentorFee: 0, mentorProgramFee: 0, statusComp: "0.00",
    commissionPercentage: "80.00%", endUnits: 0.50,
  },
  {
    id: "34618903", status: "Withdrawn", transactionId: "34618903",
    actualCloseDate: "-", scheduledCloseDate: "01/06/2026",
    paymentSettledDate: "-", gciSum: 50420.0, salesPrice: 880000.0,
    transactionType: "Landlord", currency: "USD",
    propertyAddress: "3801 La Fiesta Way, Citrus Heights, CA 95762, US",
    isBuyerAgent: "False", coAgentPercentage: "0.00%",
    agentPayablePercentage: "100.00%", agentNetCommission: 18455.26,
    companyCommission: 13085.26, netPayment: 3480.01, capPayment: 0,
    firstCap: "26.80", brokerReviewFee: 508.84, transactionCoordinatorFee: 0,
    mentorFee: 0, mentorProgramFee: 0, statusComp: "18.14",
    commissionPercentage: "100.00%", endUnits: 1,
  },
  {
    id: "36254774", status: "Pending", transactionId: "36254774",
    actualCloseDate: "-", scheduledCloseDate: "01/08/2026",
    paymentSettledDate: "-", gciSum: 0, salesPrice: 186060.0,
    transactionType: "Both Ends", currency: "USD",
    propertyAddress: "19786 Ainsworth Stockton, CA 95206, US",
    isBuyerAgent: "Yes", coAgentPercentage: "0.00%",
    agentPayablePercentage: "80.00%", agentNetCommission: 0,
    companyCommission: 0.01, netPayment: 0, capPayment: 0,
    firstCap: "0.00", brokerReviewFee: 0, transactionCoordinatorFee: 0,
    mentorFee: 0, mentorProgramFee: 0, statusComp: "0.00",
  },
];
