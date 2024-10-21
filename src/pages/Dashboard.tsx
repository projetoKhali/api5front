import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Filter from '../components/filter';
import Card from '../components/Card';
import BarChart from '../components/barChart';
import { getDashboardData } from '../service/Dashboard';
import PieChart from '../components/PieChart';
import DynamicTable from '../components/DynamicTable';
import { getDashboardTableData } from '../service/TableDashboard';
import { TableRequest } from '../schemas/TableRequest';
import { Suggestion } from '../schemas/Suggestion';
import MultiselectFilter from '../components/MultiselectFilter';
import { FormattedDashboardTableRow } from '../schemas/TableDashboard';

const Dashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recruiters, setRecruiters] = useState<Suggestion[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hiringProcesses, setHiringProcesses] = useState<Suggestion[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [vacancies, setVacancies] = useState<Suggestion[]>([]);
  const [dateStartFilter, setDateStartFilter] = useState<string>('');
  const [dateEndFilter, setDateEndFilter] = useState<string>('');
  const [chartData, setChartData] = useState<
    { month: string; duration: number }[]
  >([]);
  const [cardsData, setCardsData] = useState<{
    processOpen: string;
    processOverdue: string;
    processCloseToExpiring: string;
    processClosed: string;
    totalCandidates: string;
  } | null>(null);

  const [pieData, setPieData] = useState<{
    abertos: number;
    emAnálise: number;
    fechados: number;
  }>({
    abertos: 0,
    emAnálise: 0,
    fechados: 0,
  });
  const [tableData, setTableData] = useState<FormattedDashboardTableRow[]>([]);

  const fetchDashboard = async () => {
    const dashboardData = await getDashboardData({
      recruiters: recruiters.map(recruiter => recruiter.id),
      hiringProcesses: hiringProcesses.map(hiringProcess => hiringProcess.id),
      vacancies: vacancies.map(vacancy => vacancy.id),
      dateRange: {
        dateStartFilter,
        dateEndFilter,
      },
    });
    const { averageHiringTime, cards, vacancyStatus } = dashboardData;
    const formattedChartData = Object.keys(averageHiringTime).map(month => ({
      month: capitalize(month),
      duration: averageHiringTime[month as keyof typeof averageHiringTime],
    }));

    setChartData(formattedChartData);
    setCardsData({
      processOpen: cards.openProcess.toString(),
      processOverdue: cards.expirededProcess.toString(),
      processCloseToExpiring: cards.approachingDeadlineProcess.toString(),
      processClosed: cards.closeProcess.toString(),
      totalCandidates: cards.averageHiringTime.toString(),
    });
    setPieData({
      abertos: vacancyStatus.open,
      emAnálise: vacancyStatus.analyzing,
      fechados: vacancyStatus.closed,
    });
  };

  const fetchTableData = async () => {
    const requestPayload: TableRequest = {
      recruiters: recruiters.map(recruiter => recruiter.id),
      processes: hiringProcesses.map(hiringProcess => hiringProcess.id),
      vacancies: vacancies.map(vacancy => vacancy.id),
      dateRange: {
        startDate: dateStartFilter,
        endDate: dateEndFilter,
      },
      processStatus: [],
      vacancyStatus: [],
    };

    try {
      const response = await getDashboardTableData(requestPayload);

      if (Array.isArray(response)) {
        setTableData(response);
      } else {
        console.warn('Resposta inválida ou dados ausentes:', response);
        setTableData([]);
      }
    } catch (error) {
      console.error('Erro ao buscar dados da tabela:', error);
    }
  };

  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  const handleFilter = async () => {
    try {
      await fetchDashboard();
      await fetchTableData();
    } catch (error) {
      console.error('Erro ao aplicar filtro:', error);
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      await Promise.all([fetchDashboard(), fetchTableData()]);
    };

    initializeDashboard();
  }, []);

  const processOptions: Suggestion[] = [
    { id: 0, title: 'process 0' },
    { id: 1, title: 'process 1' },
    { id: 2, title: 'process 2' },
    { id: 3, title: 'process 3' },
    { id: 4, title: 'process 4' },
    { id: 5, title: 'process 5' },
    { id: 6, title: 'process 6' },
    { id: 7, title: 'process 7' },
    { id: 8, title: 'process 8' },
    { id: 9, title: 'process 9' },
    { id: 10, title: 'process 10' },
    { id: 11, title: 'process 11' },
    { id: 12, title: 'process 12' },
    { id: 13, title: 'process 13' },
    { id: 14, title: 'process 14' },
    { id: 15, title: 'process 15' },
    { id: 16, title: 'process 16' },
    { id: 17, title: 'process 17' },
    { id: 18, title: 'process 18' },
    { id: 19, title: 'process 19' },
    { id: 20, title: 'process 20' },
    { id: 21, title: 'process 21' },
    { id: 22, title: 'process 22' },
    { id: 23, title: 'process 23' },
    { id: 24, title: 'process 24' },
    { id: 25, title: 'process 25' },
    { id: 26, title: 'process 26' },
    { id: 27, title: 'process 27' },
    { id: 28, title: 'process 28' },
    { id: 29, title: 'process 29' },
    { id: 30, title: 'process 30' },
    { id: 31, title: 'process 31' },
    { id: 32, title: 'process 32' },
  ];

  const vacancyOptions: Suggestion[] = [
    { id: 0, title: 'vacancy 0' },
    { id: 1, title: 'vacancy 1' },
    { id: 2, title: 'vacancy 2' },
    { id: 3, title: 'vacancy 3' },
    { id: 4, title: 'vacancy 4' },
    { id: 5, title: 'vacancy 5' },
    { id: 6, title: 'vacancy 6' },
    { id: 7, title: 'vacancy 7' },
    { id: 8, title: 'vacancy 8' },
    { id: 9, title: 'vacancy 9' },
    { id: 10, title: 'vacancy 10' },
    { id: 11, title: 'vacancy 11' },
    { id: 12, title: 'vacancy 12' },
    { id: 13, title: 'vacancy 13' },
    { id: 14, title: 'vacancy 14' },
    { id: 15, title: 'vacancy 15' },
    { id: 16, title: 'vacancy 16' },
    { id: 17, title: 'vacancy 17' },
    { id: 18, title: 'vacancy 18' },
    { id: 19, title: 'vacancy 19' },
    { id: 20, title: 'vacancy 20' },
    { id: 21, title: 'vacancy 21' },
    { id: 22, title: 'vacancy 22' },
    { id: 23, title: 'vacancy 23' },
    { id: 24, title: 'vacancy 24' },
    { id: 25, title: 'vacancy 25' },
    { id: 26, title: 'vacancy 26' },
    { id: 27, title: 'vacancy 27' },
    { id: 28, title: 'vacancy 28' },
    { id: 29, title: 'vacancy 29' },
    { id: 30, title: 'vacancy 30' },
    { id: 31, title: 'vacancy 31' },
    { id: 32, title: 'vacancy 32' },
    { id: 33, title: 'vacancy 33' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        {[
          { title: 'Recrutadores', options: recruiters },
          { title: 'Processos Seletivos', options: processOptions },
          { title: 'Vagas', options: vacancyOptions },
        ].map((filter, index) => (
          <MultiselectFilter
            key={index}
            placeholder={filter.title}
            options={filter.options}
            onChange={() => {}}
          />
        ))}
        <Filter
          placeholder="Data Inicial"
          type="date"
          onChange={date => setDateStartFilter(date)}
        />
        <Filter
          placeholder="Data Final"
          type="date"
          onChange={date => setDateEndFilter(date)}
        />
        <TouchableOpacity style={styles.button} onPress={handleFilter}>
          <Text style={styles.buttonText}>Filtrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardSection}>
        <Card
          titleCard="Processos Abertos"
          valueCard={cardsData?.processOpen ?? ''}
        />
        <Card
          titleCard="Processos Vencidos"
          valueCard={cardsData?.processOverdue ?? ''}
        />
        <Card
          titleCard="Processos a Vencer"
          valueCard={cardsData?.processCloseToExpiring ?? ''}
        />
        <Card
          titleCard="Processos Encerrados"
          valueCard={cardsData?.processClosed ?? ''}
        />
        <Card
          titleCard="Total de Candidaturas"
          valueCard={cardsData?.totalCandidates ?? ''}
        />
      </View>

      <View style={styles.chartSection}>
        <View style={styles.graph}>
          <BarChart data={chartData} />
        </View>
        <View style={styles.pieChart}>
          <PieChart title={'Processo Seletivo'} data={pieData} />
        </View>

        <View style={styles.tableSection}>
          {tableData && tableData.length > 0 ? (
            <DynamicTable tableData={tableData} />
          ) : (
            <Text>Nenhum dado disponível</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DCDADA',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  filterSection: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: '#EDE7E7',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    paddingVertical: 10,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#F28727',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 5,
    width: 100,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '100%',
    paddingHorizontal: '3%',
    gap: 10,
  },
  graph: {
    width: '68%',
    minWidth: 350,
    minHeight: 200,
  },
  pieChart: {
    width: '30%',
    minWidth: 350,
  },
  cardSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
    padding: '1%',
    paddingHorizontal: '1%',
    gap: 10,
  },
  tableSection: {
    width: '100%',
    paddingTop: '1%',
  },
});

export default Dashboard;
