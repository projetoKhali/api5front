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
      open: Math.round(Math.random() * 100),
      expired: Math.round(Math.random() * 100),
      hired: Math.round(Math.random() * 100),
    },
    cards: {
      processOpen: Math.round(Math.random() * 100),
      processOverdue: Math.round(Math.random() * 100),
      processCloseToExpiring: Math.round(Math.random() * 100),
      processClosed: Math.round(Math.random() * 100),
      totalCandidates: Math.round(Math.random() * 100),
    },
    months: {
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
    }
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockResponse);
    }, 500); 
  });
}