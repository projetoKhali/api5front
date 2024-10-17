import axios from 'axios';
import TableRowResponse from '../schemas/TableDashboard';


export async function getMockTableDashboardData(): Promise<TableRowResponse> {
    const mockResponse: TableRowResponse = {
        tableData: [
            {
                "Nome da vaga": "Desenvolvedor Frontend",
                "Total das vagas": 5,
                "Total de candidatos": 50,
                "Taxa de concorrencia": 10,
                "Total de entrevistados": 20,
                "Total contratados": 3,
                "Tempo médio de contratação": 30, // em dias
                "Total de feedbacks": 15,
            },
            {
                "Nome da vaga": "Gerente de Projetos",
                "Total das vagas": 2,
                "Total de candidatos": 15,
                "Taxa de concorrencia": 7.5,
                "Total de entrevistados": 10,
                "Total contratados": 1,
                "Tempo médio de contratação": 45, // em dias
                "Total de feedbacks": 8,
            },
            {
                "Nome da vaga": "Analista de Dados",
                "Total das vagas": 3,
                "Total de candidatos": 30,
                "Taxa de concorrencia": 10,
                "Total de entrevistados": 12,
                "Total contratados": 2,
                "Tempo médio de contratação": 40, // em dias
                "Total de feedbacks": 10,
            },
        ]
    };
  
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockResponse);
      }, 500); 
    });
  }