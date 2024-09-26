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
  totalCandidates: number,
}

interface Months {
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
}

export default interface DashboardResponse {
  status: Status;
  cards: Cards;
  months: Months;
}
