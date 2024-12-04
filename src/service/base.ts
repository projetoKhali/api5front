import axios from 'axios';
import { Page, PageRequest, emptyPage } from '../schemas/Misc';
import { getApiUrl } from '../Env';

const headers = {
  headers: {
    'Content-Type': 'application/json',
  },
};

type Method = 'get' | 'post' | 'put' | 'delete';

const validateMethod = (method: Method): boolean =>
  ['get', 'post', 'put', 'delete'].includes(method);

export async function processRequest<R, T>(
  method: Method,
  path: string,
  body?: R,
): Promise<T> {
  if (!validateMethod(method)) throw new Error(`Invalid method: ${method}`);
  const url = `${getApiUrl()}/api/v1/${path}`;
  const response = await axios[method]<T>(url, body, headers);
  return response.data;
}

export const processPaginatedRequest = async <T>(
  method: Method,
  path: string,
  body?: PageRequest,
): Promise<Page<T>> =>
  (await processRequest<PageRequest, Page<T>>(method, path, body)) ||
  emptyPage();
