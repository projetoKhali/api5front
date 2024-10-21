
export interface TableRequest {
    recruiters: number[];
    processes: number[];
    vacancies: number[];
    dateRange: {
        startDate: string;
        endDate: string;
    };
    processStatus: number[];
    vacancyStatus: number[];
}