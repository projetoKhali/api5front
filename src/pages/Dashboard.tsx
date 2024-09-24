import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import Filter from '../components/filter';
import Card from '../components/Card';
import BarChart from '../components/barChart';
import { getMockDashboardData} from '../service/Dashboard';

const Dashboard = () => {
  const [hiringProcess, setHiringProcess] = useState<string>('');
  const [vacancy, setVacancy] = useState<string>('');
  const [dateStartFiltro, setDateStartFiltro] = useState<string>('');
  const [dateEndtFiltro, setDateEndFiltro] = useState<string>('');
  const [chartData, setChartData] = useState<{ month: string; duration: string }[]>([]);

  const buildUrlWithFilters = () => {
    let url = 'https://example.com/api/dashboard?';

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
      const dashboardData = await getMockDashboardData();
      // const dashboard = await getDashboardData(url);
      // console.log(dashboard);

      const { months } = dashboardData;

      const formattedChartData = Object.keys(months).map((month) => ({
        month: capitalize(month),
        duration: months[month as keyof typeof months],
      }));

      setChartData(formattedChartData);
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
        <Card titleCard="Candidatos" valueCard="120" />
        <Card titleCard="Vagas Abertas" valueCard="25" />
        <Card titleCard="Processos Ativos" valueCard="3" />
        <Card titleCard="Candidatos" valueCard="120" />
        <Card titleCard="Vagas Abertas" valueCard="25" />
        <Card titleCard="Processos Ativos" valueCard="3" />
      </View>
      <View style={styles.graph}>
        <View style={styles.chartSection}>
          <BarChart data={chartData} />
        </View>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCDADA',
    width: width,
    height: height,
    alignItems: 'center',
  },
  filterSection: {
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
    width: width * 0.7,
    justifyContent: 'flex-start',
    alignItems: 'flex-start', 
    paddingVertical: 20,
  },
  graph: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
    borderRadius: 10,
  },
});

export default Dashboard;
