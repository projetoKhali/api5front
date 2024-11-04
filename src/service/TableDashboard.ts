import axios from 'axios';
import {
  DashboardTableRow,
  FormattedDashboardTableRow,
} from '../schemas/TableDashboard';
import { DashboardFilter } from '../schemas/Dashboard';

const API_URL: string = 'http://localhost:8080';

export async function getDashboardTableData(
  tableRequest: DashboardFilter,
): Promise<FormattedDashboardTableRow[]> {
  try {
    const response = await axios.post<DashboardTableRow>(
      `${API_URL}/api/v1/hiring-process/table`,
      tableRequest,
    );
    console.log('Dados recebidos da API:', response.data);

    return response.data.factHiringProcess.map(item => ({
      'Nome da vaga': item.title,
      'Total das vagas': item.numPositions,
      'Total de candidatos': item.numCandidates,
      'Taxa de concorrencia': item.competitionRate,
      'Total de entrevistados': item.numInterviewed,
      'Total contratados': item.numHired,
      'Tempo médio de contratação': item.averageHiringTime ? item.averageHiringTime : 0,
      'Total de feedbacks': item.numFeedback,
    }));
  } catch (error) {
    console.error('Erro ao buscar dados da tabela:', error);
    throw error;
  }
}