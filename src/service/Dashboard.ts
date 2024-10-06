import axios from 'axios';
import DashboardResponse from '../schemas/DashboardProcess';

const API_URL: string = 'http://localhost:8080';

export async function getDashboardData(param: string): Promise<DashboardResponse> {
  try {
    const response = await axios.get<DashboardResponse>(`${API_URL}/api/v1/hiring-process/dashboard/${param}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    throw error;
  }
}

export async function getMockDashboardData(): Promise<DashboardResponse> {
  const mockResponse: DashboardResponse = {
    vacancyStatus: {
      open: Math.round(Math.random() * 100),
      analyzing: Math.round(Math.random() * 100),
      closed: Math.round(Math.random() * 100),
    },
    cards: {
      openProcess: Math.round(Math.random() * 100),
      expirededProcess: Math.round(Math.random() * 100),
      approachingDeadlineProcess: Math.round(Math.random() * 100),
      closeProcess: Math.round(Math.random() * 100),
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
