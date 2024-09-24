import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import Filter from '../components/filter';
import Card from '../components/Card';
import BarChart from '../components/barChart';

const Dashboard = () => {
  const [hiringProcess, setHiringProcess] = useState<string>('');
  const [vacancy, setVacancy] = useState<string>('');
  const [dateStartFiltro, setDateStartFiltro] = useState<string>('');
  const [dateEndtFiltro, setDateEndFiltro] = useState<string>('');

  // Dados para o gráfico de barras
  const chartData = [
    { month: 'Jan', duration: '10:23:40' },
    { month: 'Fev', duration: '12:23:00' },
    { month: 'Mar', duration: '8:23:15' },
    { month: 'Abr', duration: '15:12:09' },
    { month: 'Mai', duration: '7:40:00' },
    { month: 'Jun', duration: '11:15:30' },
  ];

  const handleFilter = () => {
    console.log('Processo Seletivo:', hiringProcess);
    console.log('Vaga:', vacancy);
    console.log('Data Inicio:', dateStartFiltro);
    console.log('Data Final:', dateEndtFiltro);
  };

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
    width: width * 0.4,
    height: height * 0.4,
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
