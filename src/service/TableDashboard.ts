import axios from 'axios';
import {
  DashboardTablePage,
  FactHiringProcessItem,
  FormattedDashboardTablePage,
  FormattedFactHiringProcessItem,
} from '../schemas/TableDashboard';
import { DashboardFilter } from '../schemas/Dashboard';
import { getApiUrl } from '../Env';

const formatFactHiringProcessItem = (
  row: FactHiringProcessItem,
): FormattedFactHiringProcessItem => ({
  Processo: row.processTitle,
  Vaga: row.vacancyTitle,
  'Total das vagas': row.numPositions,
  'Total de candidatos': row.numCandidates,
  'Taxa de concorrencia': row.competitionRate,
  'Total de entrevistados': row.numInterviewed,
  'Total contratados': row.numHired,
  'Tempo médio de contratação': parseFloat(
    row.averageHiringTime?.toFixed(2) || '0',
  ),
  'Total de feedbacks': row.numFeedback,
});

export async function getDashboardTableData(
  tableRequest: DashboardFilter,
): Promise<FormattedDashboardTablePage> {
  const response = await axios.post<DashboardTablePage>(
    `${getApiUrl()}/api/v1/hiring-process/table`,
    tableRequest,
  );

  return {
    ...response.data,
    factHiringProcess:
      response.data?.factHiringProcess?.map(formatFactHiringProcessItem) || [],
  };
}

export async function fetchAllPagesData(
  tableRequest: DashboardFilter,
): Promise<FormattedFactHiringProcessItem[]> {
  let currentPage = 1;
  let allData: FormattedFactHiringProcessItem[] = [];

  while (true) {
    const pageRequest = { ...tableRequest, page: currentPage };
    const response = await axios.post<DashboardTablePage>(
      `${getApiUrl()}/api/v1/hiring-process/table`,
      pageRequest,
    );

    allData = allData.concat(
      response.data.factHiringProcess.map(formatFactHiringProcessItem),
    );

    if (currentPage >= response.data.numMaxPages) break;

    currentPage++;
  }

  return allData;
}

// Função para gerar o arquivo CSV a partir dos dados
export function generateCSV(data: FormattedFactHiringProcessItem[]): void {
  const csvRows: string[] = [];

  // Cria o cabeçalho do CSV
  const headers = Object.keys(data[0]) as Array<
    keyof FormattedFactHiringProcessItem
  >;
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
