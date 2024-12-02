import axios from 'axios';
import { getSuggestionsRecruiter, getSuggestionsProcess, getSuggestionsVacancy } from '../../src/service/Suggestions';
import { Suggestion } from '../../src/schemas/Suggestion';
import * as Env from '../../src/Env'; // Certifique-se de importar o módulo Env corretamente

jest.mock('axios');
jest.mock('../../src/Env', () => ({
  getApiUrl: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  // Mock da variável de ambiente para os testes
  process.env.API_URL = 'http://localhost:8080';  // Defina o valor correto da URL da API

  // Mock da função getApiUrl para garantir que retorne a URL correta
  (Env.getApiUrl as jest.Mock).mockReturnValue(process.env.API_URL);
});

const mockSuggestions: Suggestion[] = [
  { id: 1, title: 'Suggestion 1' },
  { id: 2, title: 'Suggestion 2' },
];

describe('Suggestions Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSuggestionsRecruiter', () => {
    it('should fetch suggestions for recruiter successfully', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockSuggestions });

      const result = await getSuggestionsRecruiter();

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/api/v1/suggestions/recruiter');
      expect(result).toEqual(mockSuggestions);
    });

    it('should return an empty array if no data is returned', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: null });

      const result = await getSuggestionsRecruiter();

      expect(result).toEqual([]);
    });
  });

  describe('getSuggestionsProcess', () => {
    it('should fetch suggestions for a process successfully', async () => {
      const ids = [1, 2, 3];
      mockedAxios.post.mockResolvedValueOnce({ data: mockSuggestions });

      const result = await getSuggestionsProcess(ids);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/suggestions/process',
        ids,
        { headers: { 'Content-Type': 'application/json' } }
      );
      expect(result).toEqual(mockSuggestions);
    });

    it('should return an empty array if no data is returned for process', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: null });

      const result = await getSuggestionsProcess([1, 2]);

      expect(result).toEqual([]);
    });
  });

  describe('getSuggestionsVacancy', () => {
    it('should fetch suggestions for a vacancy successfully', async () => {
      const ids = [4, 5, 6];
      mockedAxios.post.mockResolvedValueOnce({ data: mockSuggestions });

      const result = await getSuggestionsVacancy(ids);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/suggestions/vacancy',
        ids,
        { headers: { 'Content-Type': 'application/json' } }
      );
      expect(result).toEqual(mockSuggestions);
    });

    it('should return an empty array if no data is returned for vacancy', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: null });

      const result = await getSuggestionsVacancy([4, 5]);

      expect(result).toEqual([]);
    });
  });
});
