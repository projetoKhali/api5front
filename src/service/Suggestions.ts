import axios from 'axios';
import { Suggestion } from '../schemas/Suggestion';

const API_URL: string = 'http://localhost:8080';

export async function getSuggestionsRecruiter(): Promise<Suggestion[]> {
  try {
    const response = await axios.get<Suggestion[]>(
      `${API_URL}/api/v1/suggestions/recruiter`,
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
}

export async function getSuggestionsProcess(
  ids: number[],
): Promise<Suggestion[]> {
  try {
    const response = await axios.post<Suggestion[]>(
      `${API_URL}/api/v1/suggestions/process`,
      ids,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar os dados:', error);
    throw error;
  }
}

export async function getSuggestionsVacancy(
  ids: number[],
): Promise<Suggestion[]> {
  try {
    const response = await axios.post<Suggestion[]>(
      `${API_URL}/api/v1/suggestions/vacancy`,
      ids,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar os dados:', error);
    throw error;
  }
}
