import axios from 'axios';
import { Page, PageRequest, emptyPage } from '../schemas/Misc';
import { getApiUrl } from '../Env';

const headers = {
  headers: {
    'Content-Type': 'application/json',
  },
};

type Method = 'get' | 'post' | 'put' | 'delete';

export const validateMethod = (method: Method): boolean =>
  ['get', 'post', 'put', 'delete'].includes(method);

export async function processRequest<R, T>(path: string, body: R): Promise<T> {
  const url = `${getApiUrl()}/api/v1/${path}`;
  const response = await axios.post<T>(url, body, headers);
  return response.data;
}

export const processPaginatedRequest = async <T>(
  path: string,
  body: PageRequest,
): Promise<Page<T>> =>
  (await processRequest<PageRequest, Page<T>>(path, body)) || emptyPage();
