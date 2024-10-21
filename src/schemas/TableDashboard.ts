export interface DashboardTableRow {
  title: string;
  numPositions: number;
  numCandidates: number;
  competitionRate: number;
  numInterviewed: number;
  numHired: number;
  averageHiringTime: number;
  numFeedback: number;
}

export interface FormattedDashboardTableRow {
  'Nome da vaga': string;
  'Total das vagas': number;
  'Total de candidatos': number;
  'Taxa de concorrencia': number;
  'Total de entrevistados': number;
  'Total contratados': number;
  'Tempo médio de contratação': number;
  'Total de feedbacks': number;
}
