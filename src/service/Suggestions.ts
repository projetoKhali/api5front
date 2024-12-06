import { Page, PageFilterRequest, Suggestion } from '../schemas/Misc';
import { processPaginatedRequest, processRequest } from './base';

export type SuggestionsParams = {
  departments: number[];
};

export type SuggestionsWithIdsParams = SuggestionsParams & {
  ids: number[];
};

export async function getSuggestionsRecruiter(
  body: PageFilterRequest<SuggestionsParams>,
): Promise<Page<Suggestion>> {
  return processPaginatedRequest('post', 'suggestions/recruiter', body);
}

export async function getSuggestionsProcess(
  body: PageFilterRequest<SuggestionsWithIdsParams>,
): Promise<Page<Suggestion>> {
  return processPaginatedRequest('post', 'suggestions/process', body);
}

export async function getSuggestionsVacancy(
  body: PageFilterRequest<SuggestionsWithIdsParams>,
): Promise<Page<Suggestion>> {
  return processPaginatedRequest('post', 'suggestions/vacancy', body);
}

export async function getSuggestionsDepartment(): Promise<Suggestion[]> {
  return processRequest('get', 'suggestions/department');
}
