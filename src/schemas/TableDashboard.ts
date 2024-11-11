export interface DashboardTablePage {
  factHiringProcess: FactHiringProcessItem[];
  numMaxPages: number;
}

export interface FormattedDashboardTablePage {
  factHiringProcess: FormattedFactHiringProcessItem[];
  numMaxPages: number;
}

export interface FactHiringProcessItem {
  processTitle: string;
  vacancyTitle: string;
  numPositions: number;
  numCandidates: number;
  competitionRate: number;
  numInterviewed: number;
  numHired: number;
  averageHiringTime: number | null;
  numFeedback: number;
}

export interface FormattedFactHiringProcessItem {
  Processo: string;
  Vaga: string;
  'Total das vagas': number;
  'Total de candidatos': number;
  'Taxa de concorrencia': number;
  'Total de entrevistados': number;
  'Total contratados': number;
  'Tempo médio de contratação': number | null;
  'Total de feedbacks': number;
}
