// Definindo a interface para os itens individuais no array "factHiringProcess"
interface FactHiringProcessItem {
  title: string;
  numPositions: number;
  numCandidates: number;
  competitionRate: number;
  numInterviewed: number;
  numHired: number;
  averageHiringTime: number | null;
  numFeedback: number;
}

export interface DashboardTableRow {
  factHiringProcess: FactHiringProcessItem[];  // Array de objetos conforme a requisição
  numMaxPages: number;  // Adicionado o número de páginas máximas conforme a request
}

// Definindo a interface formatada para exibir os dados em um formato específico (opcional, caso precise de transformação)
export interface FormattedDashboardTableRow {
  'Nome da vaga': string;
  'Total das vagas': number;
  'Total de candidatos': number;
  'Taxa de concorrencia': number;
  'Total de entrevistados': number;
  'Total contratados': number;
  'Tempo médio de contratação': number | null;
  'Total de feedbacks': number;
}
