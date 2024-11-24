import axios from 'axios';
import DashboardResponse, { DashboardFilter } from '../schemas/Dashboard';
import { getApiUrl } from '../Env';

export async function getDashboardData(
  params: DashboardFilter,
): Promise<DashboardResponse> {
  const response = await axios.post<DashboardResponse>(
    `${getApiUrl()}/api/v1/hiring-process/dashboard`,
    params,
  );

  return response.data || [];
}

export async function getMockDashboardData(): Promise<DashboardResponse> {
  const mockResponse: DashboardResponse = {
    vacancyStatus: {
      open: Math.round(Math.random() * 100),
      analyzing: Math.round(Math.random() * 100),
      closed: Math.round(Math.random() * 100),
    },
    cards: {
      open: Math.round(Math.random() * 100),
      inProgress: Math.round(Math.random() * 100),
      approachingDeadline: Math.round(Math.random() * 100),
      closed: Math.round(Math.random() * 100),
      averageHiringTime: Math.round(Math.random() * 100),
    },
    averageHiringTime: {
      january: Math.round(Math.random() * 100),
      february: Math.round(Math.random() * 100),
      march: Math.round(Math.random() * 100),
      april: Math.round(Math.random() * 100),
      may: Math.round(Math.random() * 100),
      june: Math.round(Math.random() * 100),
      july: Math.round(Math.random() * 100),
      august: Math.round(Math.random() * 100),
      september: Math.round(Math.random() * 100),
      october: Math.round(Math.random() * 100),
      november: Math.round(Math.random() * 100),
      december: Math.round(Math.random() * 100),
    },
  };

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockResponse);
    }, 500);
  });
}
