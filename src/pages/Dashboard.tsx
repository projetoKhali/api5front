import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import Filter from '../components/filter';
import Card from '../components/Card';
import BarChart from '../components/barChart';
import { getDashboardData} from '../service/Dashboard';
import PieChart from '../components/PieChart';

const Dashboard = () => {
  const [hiringProcess, setHiringProcess] = useState<string>('');
  const [vacancy, setVacancy] = useState<string>('');
  const [dateStartFiltro, setDateStartFiltro] = useState<string>('');
  const [dateEndtFiltro, setDateEndFiltro] = useState<string>('');
  const [chartData, setChartData] = useState<{ month: string; duration: number }[]>([]);
  const [cardsData, setCardsData] = useState<{
    processOpen: string;
    processOverdue: string;
    processCloseToExpiring: string;
    processClosed: string;
    totalCandidates: string;
  } | null>(null);

  const [pieData, setPieData] = useState<{ aberto: number; concluido: number; fechado: number }>({
    aberto: 0,
    concluido: 0,
    fechado: 0,
  });

  const buildUrlWithFilters = () => {
    let url = '?';

    if (hiringProcess) url += `hiringProcess=${encodeURIComponent(hiringProcess)}&`;
    if (vacancy) url += `vacancy=${encodeURIComponent(vacancy)}&`;
    if (dateStartFiltro) url += `startDate=${encodeURIComponent(dateStartFiltro)}&`;
    if (dateEndtFiltro) url += `endDate=${encodeURIComponent(dateEndtFiltro)}&`;

    return url.endsWith('&') ? url.slice(0, -1) : url;
  };

  const fetchMockDashboard = async () => {
    const url = buildUrlWithFilters();
    console.log('URL da requisição:', url);

    try {
      const dashboardData = await getDashboardData(url);
      const { averageHiringTime, cards, vacancyStatus } = dashboardData;
      const formattedChartData = Object.keys(averageHiringTime).map((month) => ({
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
        aberto: vacancyStatus.open,
        concluido: vacancyStatus.analyzing,
        fechado: vacancyStatus.closed,
      });

    } catch (error) {
      console.error('Erro ao buscar dados do mock:', error);
    }
  };

  const handleFilter = () => {
    fetchMockDashboard();
  };

  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

  useEffect(() => {
    fetchMockDashboard();
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.filterSection}>
        <Filter
          placeholder="Filtro de Processos Seletivos"
          type="text"
          onChange={(text) => setHiringProcess(text)}
        />
        <Filter
          placeholder="Filtro de vagas"
          type="text"
          onChange={(text) => setVacancy(text)}
        />
        <Filter
          placeholder="Data Inicial"
          type="date"
          onChange={(date) => setDateStartFiltro(date)}
        />
        <Filter
          placeholder="Data Final"
          type="date"
          onChange={(date) => setDateEndFiltro(date)}
        /> 
        <TouchableOpacity style={styles.button} onPress={handleFilter}>
          <Text style={styles.buttonText}>Filtrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardSection}>
        <Card titleCard="Processos Abertos" valueCard={cardsData?.processOpen ?? ''} />
        <Card titleCard="Processos Vencidos" valueCard={cardsData?.processOverdue ?? ''} />
        <Card titleCard="Processos a Vencer" valueCard={cardsData?.processCloseToExpiring ?? ''} />
        <Card titleCard="Processos Encerrados" valueCard={cardsData?.processClosed ?? ''} />
        <Card titleCard="Tempo médio contratação" valueCard={cardsData?.totalCandidates ?? ''} />
      </View>

      <View style={styles.chartSection}>
        <View style={styles.graph}>
          <BarChart data={chartData} />
        </View>
        <View style={styles.pieChart}>
          <PieChart
            title={'Status das vagas'}
            aberto={pieData.aberto}
            concluido={pieData.concluido}
            fechado={pieData.fechado} />
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
    paddingBottom: 20
  },
  filterSection: {
    minHeight: 0,
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
    gap: 10
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
