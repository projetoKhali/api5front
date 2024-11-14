import axios from 'axios';
import { Page, PageRequest, emptyPage } from '../schemas/Misc';

const API_URL: string = 'http://localhost:8080';
const API_VERSION: number = 1;

const headers = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export async function processRequest<R, T>(path: string, body: R): Promise<T> {
  const url = `${API_URL}/api/v${API_VERSION}/${path}`;
  const response = await axios.post<T>(url, body, headers);
  return response.data;
}

export const processPaginatedRequest = async <T>(
  path: string,
  body: PageRequest,
): Promise<Page<T>> =>
  (await processRequest<PageRequest, Page<T>>(path, body)) || emptyPage();
