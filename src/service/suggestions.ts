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
