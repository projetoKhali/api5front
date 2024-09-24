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
      january: "20:00:00",
      february: "21:00:00",
      march: "22:00:00",
      april: "23:00:00",
      may: "00:00:00",
      june: "01:00:00",
      july: "02:00:00",
      august: "03:00:00",
      september: "04:00:00",
      october: "05:00:00",
      november: "06:00:00",
      december: "07:00:00",
    }
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockResponse);
    }, 500); 
  });
}