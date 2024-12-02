import { Page, PageFilterRequest, Suggestion } from '../schemas/Misc';
import { processPaginatedRequest } from './base';

export type SuggestionsParams = {
  departments: number[];
};

export type SuggestionsWithIdsParams = SuggestionsParams & {
  ids: number[];
};

export async function getSuggestionsRecruiter(
  body: PageFilterRequest<SuggestionsParams>,
): Promise<Page<Suggestion>> {
  return processPaginatedRequest('suggestions/recruiter', body);
}

export async function getSuggestionsProcess(
  body: PageFilterRequest<SuggestionsWithIdsParams>,
): Promise<Page<Suggestion>> {
  return processPaginatedRequest('suggestions/process', body);
}

export async function getSuggestionsVacancy(
  body: PageFilterRequest<SuggestionsWithIdsParams>,
): Promise<Page<Suggestion>> {
  return processPaginatedRequest('suggestions/vacancy', body);
}


export async function getSuggestionsDepartment(
): Promise<Suggestion[]> {
  const response = await axios.get<Suggestion[]>(
    `${getApiUrl()}/api/v1/suggestions/department`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data || [];
}
