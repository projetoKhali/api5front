import DashboardResponse, { DashboardFilter } from '../schemas/Dashboard';
import { processRequest } from './base';

export async function getDashboardData(
  params: DashboardFilter,
): Promise<DashboardResponse> {
  return await processRequest<DashboardFilter, DashboardResponse>(
    'hiring-process/dashboard',
    params,
  ) || [];
}

