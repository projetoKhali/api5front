import axios from 'axios';
import DashboardResponse from '../schemas/DashboardProcess';

const API_URL: string = 'http://localhost:8080';

export async function getDashboardData(param: string): Promise<DashboardResponse> {
  try {
    const response = await axios.get<DashboardResponse>(`${API_URL}/dashboard/${param}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    throw error;
  }
}


export async function getMockDashboardData(): Promise<DashboardResponse> {
  const mockResponse: DashboardResponse = {
    status: {
      open: 10,
      expired: 7,
      hired: 3,
    },
    cards: {
      processOpen: 2,
      processOverdue: 1,
      processCloseToExpiring: 0,
      processClosed: 4,
      totalCandidates: 425
    },
    months: {
      january: 23.4,
      february: 14,
      march: 16,
      april: 31,
      may: 13,
      june: 20,
      july: 11,
      august: 5,
      september: 8,
      october: 12.7,
      november: 11,
      december: 10,
    }
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockResponse);
    }, 500); 
  });
}