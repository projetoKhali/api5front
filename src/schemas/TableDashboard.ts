interface FactHiringProcessItem {
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

export interface DashboardTableRow {
  factHiringProcess: FactHiringProcessItem[];  
  numMaxPages: number;
}

export interface FormattedDashboardTableRow {
  'Nome do Processo': string;
  'Nome da vaga': string;
  'Total das vagas': number;
  'Total de candidatos': number;
  'Taxa de concorrencia': number;
  'Total de entrevistados': number;
  'Total contratados': number;
  'Tempo médio de contratação': number | null;
  'Total de feedbacks': number;
}