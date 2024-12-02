import axios from 'axios';
import { BodySuggestion, Suggestion } from '../schemas/Suggestion';
import { getApiUrl } from '../Env';

export async function getSuggestionsRecruiter(
  ids: number[],
): Promise<Suggestion[]> {
  const response = await axios.post<Suggestion[]>(
    `${getApiUrl()}/api/v1/suggestions/recruiter`,
    ids,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data || [];
}



export async function getSuggestionsProcess(
  ids: BodySuggestion,
): Promise<Suggestion[]> {
  const response = await axios.post<Suggestion[]>(
    `${getApiUrl()}/api/v1/suggestions/process`,
    ids,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data || [];
}

export async function getSuggestionsVacancy(
  ids: BodySuggestion,
): Promise<Suggestion[]> {
  const response = await axios.post<Suggestion[]>(
    `${getApiUrl()}/api/v1/suggestions/vacancy`,
    ids,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data || [];
}
