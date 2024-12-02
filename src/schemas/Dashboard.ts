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
  page: number;
  pageSize: number;
  groupAccess: number[] | null;
}

interface DashboardVacancyStatus {
  open: number;
  analyzing: number;
  closed: number;
}

interface DashboardCardsInfo {
  open: number;
  inProgress: number;
  closed: number;
  approachingDeadline: number;
  averageHiringTime: number;
}

interface DashboardAverageHiringTime {
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
  vacancyStatus: DashboardVacancyStatus;
  cards: DashboardCardsInfo;
  averageHiringTime: DashboardAverageHiringTime;
}
