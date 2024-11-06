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

    return response.data.factHiringProcess.map((item): FormattedDashboardTableRow => ({
      'Nome da vaga': item.title,
      'Total das vagas': item.numPositions,
      'Total de candidatos': item.numCandidates,
      'Taxa de concorrencia': item.competitionRate,
      'Total de entrevistados': item.numInterviewed,
      'Total contratados': item.numHired,
      'Tempo médio de contratação': item.averageHiringTime != null 
        ? parseFloat(item.averageHiringTime.toFixed(2))
        : 0,
      'Total de feedbacks': item.numFeedback,
    }));
  } catch (error) {
    console.error('Erro ao buscar dados da tabela:', error);
    throw error;
  }
}

export async function fetchAllPagesData(
  tableRequest: DashboardFilter
): Promise<FormattedDashboardTableRow[]> {
  let currentPage = 1;
  const allData: FormattedDashboardTableRow[] = [];

  try {
    while (true) {
      const pageRequest = { ...tableRequest, page: currentPage };
      const response = await axios.post<DashboardTableRow>(`${API_URL}/api/v1/hiring-process/table`, pageRequest);
      
      allData.push(
        ...response.data.factHiringProcess.map((item): FormattedDashboardTableRow => ({
          'Nome da vaga': item.title,
          'Total das vagas': item.numPositions,
          'Total de candidatos': item.numCandidates,
          'Taxa de concorrencia': item.competitionRate,
          'Total de entrevistados': item.numInterviewed,
          'Total contratados': item.numHired,
          'Tempo médio de contratação': item.averageHiringTime != null
            ? parseFloat(item.averageHiringTime.toFixed(2))
            : 0,
          'Total de feedbacks': item.numFeedback,
        }))
      );

      if (currentPage >= response.data.numMaxPages) break;
      
      currentPage++;
    }
  } catch (error) {
    console.error('Erro ao buscar todas as páginas:', error);
    throw error;
  }

  return allData;
}

// Função para gerar o arquivo CSV a partir dos dados
export function generateCSV(data: FormattedDashboardTableRow[]): void {
  const csvRows: string[] = [];

  // Cria o cabeçalho do CSV
  const headers = Object.keys(data[0]) as Array<keyof FormattedDashboardTableRow>;
  csvRows.push(headers.join(','));

  // Adiciona cada linha dos dados no formato CSV
  data.forEach(row => {
    const values = headers.map(header => JSON.stringify(row[header]));
    csvRows.push(values.join(','));
  });

  // Cria o blob CSV e inicia o download
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  
  // Cria um link temporário para download
  const link = document.createElement('a');
  link.href = url;
  link.download = 'dashboard_data.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Libera o objeto de URL
  window.URL.revokeObjectURL(url);
}
