import axios from 'axios';
import DashboardResponse from '../schemas/DashboardProcess';

const API_URL: string = 'http://localhost:8080';

export async function getDashboardData(param: string): Promise<DashboardResponse> {
  try {
    const response = await axios.get<DashboardResponse>(`${API_URL}/api/v1/hiring-process/dashboard${param}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    throw error;
  }
}


export async function getMockDashboardData(): Promise<DashboardResponse> {
  const mockResponse: DashboardResponse = {
    vacancyStatus: {
      open: 6,
      analyzing: 9,
      closed: 16,
    },
    cards: {
      openProcess: 2,
      expirededProcess: 1,
      approachingDeadlineProcess: 1,
      closeProcess: 4,
      averageHiringTime: 20.2,
    },
    averageHiringTime: {
      january: 21,
      february: 19,
      march: 20,
      april: 5,
      may: 28,
      june: 22,
      july: 24,
      august: 10,
      september: 15,
      october: 0,
      november: 0,
      december: 0,
    }
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockResponse);
    }, 500); 
  });
}

export async function getMockDashboardData1(): Promise<DashboardResponse> {
  const mockResponse: DashboardResponse = {
    vacancyStatus: {
      open: 1,
      analyzing: 2,
      closed: 1,
    },
    cards: {
      openProcess: 1,
      expirededProcess: 0,
      approachingDeadlineProcess: 0,
      closeProcess: 0,
      averageHiringTime: 14,
    },
    averageHiringTime: {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 14,
      october: 0,
      november: 0,
      december: 0,
    }
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockResponse);
    }, 500); 
  });
}

export async function getMockDashboardData2(): Promise<DashboardResponse> {
  const mockResponse: DashboardResponse = {
    vacancyStatus: {
      open: 0,
      analyzing: 1,
      closed: 1,
    },
    cards: {
      openProcess: 1,
      expirededProcess: 0,
      approachingDeadlineProcess: 0,
      closeProcess: 0,
      averageHiringTime: 14,
    },
    averageHiringTime: {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 14,
      october: 0,
      november: 0,
      december: 0,
    }
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockResponse);
    }, 500); 
  });
}

export async function getMockDashboardData3(): Promise<DashboardResponse> {
  const mockResponse: DashboardResponse = {
    vacancyStatus: {
      open: 0,
      analyzing: 0,
      closed: 0,
    },
    cards: {
      openProcess: 0,
      expirededProcess: 0,
      approachingDeadlineProcess: 0,
      closeProcess: 0,
      averageHiringTime: 0,
    },
    averageHiringTime: {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
    }
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockResponse);
    }, 500); 
  });
}