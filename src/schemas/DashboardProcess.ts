interface Status {
  open: number;
  expired: number;
  hired: number;
}

interface Cards {
  processOpen: number,
  processOverdue: number,
  processCloseToExpiring: number,
  processClosed: number,
  totalCandidates: number
  
}

interface Months {
  january: string;
  february: string;
  march: string;
  april: string;
  may: string;
  june: string;
  july: string;
  august: string;
  september: string;
  october: string;
  november: string;
  december: string;
}

export default interface DashboardResponse {
  status: Status;
  cards: Cards;
  months: Months;
}
