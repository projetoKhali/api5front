export type Status = {
  id: number;
  title: string;
};

export const vacancyStatuses: Status[] = [
  { id: 1, title: 'Aberta' },
  { id: 2, title: 'Em análise' },
  { id: 3, title: 'Fechada' },
];

export const processStatuses: Status[] = [
  { id: 1, title: 'Aberto' },
  { id: 2, title: 'Em andamento' },
  { id: 3, title: 'Concluído' },
];
