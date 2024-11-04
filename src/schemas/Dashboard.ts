export interface DashboardFilter {
  recruiters: number[];
  processes: number[];
  vacancies: number[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  processStatus: number[];
  vacancyStatus: number[];
  page: number,
  pageSize: number
}

interface vacancyStatus {
  open: number;
  analyzing: number;
  closed: number;
}

interface cards {
  openProcess: number;
  expirededProcess: number;
  approachingDeadlineProcess: number;
  closeProcess: number;
  averageHiringTime: number;
}

interface averageHiringTime {
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
  vacancyStatus: vacancyStatus;
  cards: cards;
  averageHiringTime: averageHiringTime;
}
