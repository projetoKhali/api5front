import axios from 'axios';
import { getDashboardData, getMockDashboardData } from '../../src/service/Dashboard'; // Ajuste o caminho conforme necessário
import DashboardResponse, { DashboardFilter } from '../../src/schemas/Dashboard'; // Ajuste o caminho conforme necessário
import * as Env from '../../src/Env'; // Ajuste o caminho conforme necessário

jest.mock('axios');
jest.mock('../../src/Env', () => ({
  getApiUrl: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockResponse: DashboardResponse = {
  vacancyStatus: {
    open: 20,
    analyzing: 30,
    closed: 50,
  },
  cards: {
    open: 10,
    inProgress: 15,
    approachingDeadline: 5,
    closed: 10,
    averageHiringTime: 40,
  },
  averageHiringTime: {
    january: 30,
    february: 40,
    march: 35,
    april: 45,
    may: 50,
    june: 60,
    july: 55,
    august: 50,
    september: 40,
    october: 30,
    november: 45,
    december: 60,
  },
};

describe('Dashboard Service', () => {
  beforeEach(() => {
    // Aqui, corrigimos o mock para retornar apenas a base da URL
    (Env.getApiUrl as jest.Mock).mockReturnValue('http://localhost:8080');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardData', () => {
    it('should fetch dashboard data successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const params: DashboardFilter = {
        recruiters: [1, 2],
        processes: [1, 2],
        vacancies: [1, 2],
        dateRange: { startDate: '2023-01-01', endDate: '2023-12-31' },
        processStatus: [1, 2],
        vacancyStatus: [1, 2],
        page: 1,
        pageSize: 10,
        groupAccess: [1, 2],
      };

      const result = await getDashboardData(params);

      // A URL esperada agora é corrigida para o formato correto
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/hiring-process/dashboard',
        params
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return an empty array if no data is returned', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: null });

      const params: DashboardFilter = {
        recruiters: [1, 2],
        processes: [1, 2],
        vacancies: [1, 2],
        dateRange: { startDate: '2023-01-01', endDate: '2023-12-31' },
        processStatus: [1, 2],
        vacancyStatus: [1, 2],
        page: 1,
        pageSize: 10,
        groupAccess: [1, 2],
      };

      const result = await getDashboardData(params);

      expect(result).toEqual([]);
    });
  });

  describe('getMockDashboardData', () => {
    it('should return mock data successfully', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await getMockDashboardData();

      expect(result).toHaveProperty('vacancyStatus');
      expect(result).toHaveProperty('cards');
      expect(result).toHaveProperty('averageHiringTime');
      expect(typeof result.vacancyStatus.open).toBe('number');
      expect(typeof result.cards.open).toBe('number');
    });

    it('should return mock data even if API request fails', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: null });

      const result = await getMockDashboardData();

      expect(result).toHaveProperty('vacancyStatus');
      expect(result).toHaveProperty('cards');
      expect(result).toHaveProperty('averageHiringTime');
      expect(typeof result.vacancyStatus.open).toBe('number');
    });
  });
});
