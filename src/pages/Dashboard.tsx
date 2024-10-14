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
import { Suggestion } from '../schemas/Suggestion';
import MultiselectFilter from '../components/MultiselectFilter';

const Dashboard = () => {
  const [recruiters, setRecruiters] = useState<Suggestion[]>([]);
  const [hiringProcesses, setHiringProcesses] = useState<Suggestion[]>([]);
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

  const toggleRecruiters = (recruiter: Suggestion) => {
    for (let i = 0; i < recruiters.length; i++) {
      if (recruiters[i].id === recruiter.id) {
        recruiters.splice(i, 1);
        setRecruiters(recruiters);
        return;
      }
    }
  };

  const toggleHiringProcesses = (hiringProcess: Suggestion) => {
    for (let i = 0; i < hiringProcesses.length; i++) {
      if (hiringProcesses[i].id === hiringProcess.id) {
        hiringProcesses.splice(i, 1);
        setHiringProcesses(hiringProcesses);
        return;
      }
    }
  };

  const toggleVacancies = (vacancy: Suggestion) => {
    for (let i = 0; i < vacancies.length; i++) {
      if (vacancies[i].id === vacancy.id) {
        vacancies.splice(i, 1);
        setVacancies(vacancies);
        return;
      }
    }
  };

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

  const handleFilter = () => {
    fetchDashboard();
  };

  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  useEffect(() => {
    fetchDashboard();
  }, []);

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
        <MultiselectFilter
          placeholder="Recrutadores"
          options={[]}
          onChange={suggestion => toggleRecruiters(suggestion)}
        />
        <MultiselectFilter
          placeholder="Processos Seletivos"
          options={[]}
          onChange={suggestion => toggleHiringProcesses(suggestion)}
        />
        <MultiselectFilter
          placeholder="Vagas"
          options={vacancyOptions}
          onChange={suggestion => toggleVacancies(suggestion)}
        />
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
});

export default Dashboard;
