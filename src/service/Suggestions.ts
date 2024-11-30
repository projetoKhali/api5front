import {
  Page,
  PageFilterRequest,
  PageRequest,
  Suggestion,
} from '../schemas/Misc';
import { processPaginatedRequest } from './base';

export async function getSuggestionsRecruiter(
  body: PageRequest,
): Promise<Page<Suggestion>> {
  return processPaginatedRequest('suggestions/recruiter', body);
}

export async function getSuggestionsProcess(
  body: PageFilterRequest<{ ids: number[] }>,
): Promise<Page<Suggestion>> {
  return processPaginatedRequest('suggestions/process', body);
}

export async function getSuggestionsVacancy(
  body: PageFilterRequest<{ ids: number[] }>,
): Promise<Page<Suggestion>> {
  return processPaginatedRequest('suggestions/vacancy', body);
}
