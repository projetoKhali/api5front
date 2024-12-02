import axios from 'axios';
import { getDashboardTableData, fetchAllPagesData } from '../../src/service/TableDashboard'; // Ajuste o caminho conforme necessário
import { DashboardFilter } from '../../src/schemas/Dashboard';
import { DashboardTablePage, FormattedDashboardTablePage } from '../../src/schemas/TableDashboard';
import * as Env from '../../src/Env'; // Ajuste o caminho conforme necessário

// Simulando o axios e mockando a função getApiUrl
jest.mock('axios');
jest.mock('../../src/Env', () => ({
  getApiUrl: jest.fn(),
}));

describe('Serviço de Dashboard', () => {
  beforeEach(() => {
    // Mockar a URL da API antes de cada teste
    (Env.getApiUrl as jest.Mock).mockReturnValue('http://localhost:8080');
  });

  describe('getDashboardTableData', () => {
    it('deve formatar os dados corretamente', async () => {
      const mockedResponse: DashboardTablePage = {
        factHiringProcess: [
          {
            processTitle: 'Processo A',
            vacancyTitle: 'Vaga X',
            numPositions: 10,
            numCandidates: 50,
            competitionRate: 5,
            numInterviewed: 30,
            numHired: 5,
            averageHiringTime: 7.5,
            numFeedback: 10,
          },
        ],
        numMaxPages: 1,
      };

      (axios.post as jest.Mock).mockResolvedValueOnce({ data: mockedResponse });

      const tableRequest: DashboardFilter = {
        recruiters: [1],
        processes: [1],
        vacancies: [1],
        dateRange: { startDate: '2024-01-01', endDate: '2024-12-31' },
        processStatus: [1],
        vacancyStatus: [1],
        page: 1,
        pageSize: 10,
        groupAccess: [1, 2],
      };

      const result: FormattedDashboardTablePage = await getDashboardTableData(tableRequest);

      expect(result).toEqual({
        factHiringProcess: [
          {
            Processo: 'Processo A',
            Vaga: 'Vaga X',
            'Total das vagas': 10,
            'Total de candidatos': 50,
            'Taxa de concorrencia': 5,
            'Total de entrevistados': 30,
            'Total contratados': 5,
            'Tempo médio de contratação': 7.5,
            'Total de feedbacks': 10,
          },
        ],
        numMaxPages: 1,
      });

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/hiring-process/table',
        tableRequest
      );
    });
  });

  describe('fetchAllPagesData', () => {
    it('deve buscar e formatar todos os dados das páginas corretamente', async () => {
      const mockedResponses = [
        {
          data: {
            factHiringProcess: [
              {
                processTitle: 'Processo A',
                vacancyTitle: 'Vaga X',
                numPositions: 10,
                numCandidates: 50,
                competitionRate: 5,
                numInterviewed: 30,
                numHired: 5,
                averageHiringTime: 7.5,
                numFeedback: 10,
              },
            ],
            numMaxPages: 2,
          },
        },
        {
          data: {
            factHiringProcess: [
              {
                processTitle: 'Processo B',
                vacancyTitle: 'Vaga Y',
                numPositions: 20,
                numCandidates: 80,
                competitionRate: 4,
                numInterviewed: 50,
                numHired: 10,
                averageHiringTime: 10.2,
                numFeedback: 15,
              },
            ],
            numMaxPages: 2,
          },
        },
      ];

      (axios.post as jest.Mock)
        .mockResolvedValueOnce(mockedResponses[0])
        .mockResolvedValueOnce(mockedResponses[1]);

      const tableRequest: DashboardFilter = {
        recruiters: [1],
        processes: [1],
        vacancies: [1],
        dateRange: { startDate: '2024-01-01', endDate: '2024-12-31' },
        processStatus: [1],
        vacancyStatus: [1],
        page: 1,
        pageSize: 10,
        groupAccess: [1, 2],
      };

      const result = await fetchAllPagesData(tableRequest);

      expect(result).toEqual([
        {
          Processo: 'Processo A',
          Vaga: 'Vaga X',
          'Total das vagas': 10,
          'Total de candidatos': 50,
          'Taxa de concorrencia': 5,
          'Total de entrevistados': 30,
          'Total contratados': 5,
          'Tempo médio de contratação': 7.5,
          'Total de feedbacks': 10,
        },
        {
          Processo: 'Processo B',
          Vaga: 'Vaga Y',
          'Total das vagas': 20,
          'Total de candidatos': 80,
          'Taxa de concorrencia': 4,
          'Total de entrevistados': 50,
          'Total contratados': 10,
          'Tempo médio de contratação': 10.2,
          'Total de feedbacks': 15,
        },
      ]);
    });
  });
});
