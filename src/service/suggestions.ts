import axios from 'axios';
import { SuggestionsSchema } from '../schemas/Suggestions';

const API_URL: string = 'http://localhost:8080';

export async function getSuggestionsRecruiter(): Promise<SuggestionsSchema[]> {
  try {
    const response = await axios.get<SuggestionsSchema[]>(`${API_URL}/api/v1/suggestions/recruiter`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
}

export async function postSuggestionsProcess(ids: number[]): Promise<SuggestionsSchema[]> {
    try {
      const response = await axios.post<SuggestionsSchema[]>(`${API_URL}/api/v1/suggestions/process`, ids, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao enviar os dados:', error);
      throw error;
    }
  }
  