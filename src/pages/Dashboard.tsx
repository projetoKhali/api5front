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
import { Suggestion } from '../schemas/Suggestion';
import MultiSelectFilter from '../components/MultiSelectFilter';
import { FormattedFactHiringProcessItem } from '../schemas/TableDashboard';
import {
  getSuggestionsRecruiter,
  getSuggestionsProcess,
  getSuggestionsVacancy,
} from '../service/Suggestions';
import { DashboardFilter } from '../schemas/Dashboard';
import { processStatuses, vacancyStatuses } from '../schemas/Status';

const Dashboard = () => {
  const [recruiters, setRecruiters] = useState<Suggestion[]>([]);
  const [processes, setProcesses] = useState<Suggestion[]>([]);
  const [vacancies, setVacancies] = useState<Suggestion[]>([]);

  const [selectedRecruiters, setSelectedRecruiters] = useState<Suggestion[]>(
    [],
  );
  const [selectedProcesses, setSelectedProcesses] = useState<Suggestion[]>([]);
  const [selectedVacancies, setSelectedVacancies] = useState<Suggestion[]>([]);

  const [selectedProcessStatuses, setSelectedProcessStatuses] = useState<
    Suggestion[]
  >([]);
  const [selectedVacancyStatuses, setSelectedVacancyStatuses] = useState<
    Suggestion[]
  >([]);

  type SuggestionsGetter = () => Promise<Suggestion[]>;
  const [getSuggestionsRecruiters, setGetSuggestionsRecruiters] =
    useState<SuggestionsGetter>(() => async () => recruiters);
  const [getSuggestionsProcesses, setGetSuggestionsProcesses] =
    useState<SuggestionsGetter>(() => async () => processes);
  const [getSuggestionsVacancies, setGetSuggestionsVacancies] =
    useState<SuggestionsGetter>(() => async () => vacancies);

  useEffect(() => {
    setGetSuggestionsRecruiters(() => async () => recruiters);
  }, [recruiters]);

  useEffect(() => {
    setGetSuggestionsProcesses(() => async () => processes);
  }, [processes]);

  useEffect(() => {
    setGetSuggestionsVacancies(() => async () => vacancies);
  }, [vacancies]);

  useEffect(() => {
    fetchProcesses();
    fetchVacancies();
  }, [selectedRecruiters]);

  useEffect(() => {
    fetchVacancies();
  }, [selectedProcesses]);

  const [dateStartFilter, setDateStartFilter] = useState<string>('');
  const [dateEndFilter, setDateEndFilter] = useState<string>('');

  const [page] = useState<number>(1);
  const [pageSize] = useState<number>(5);

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

  const [tableData, setTableData] = useState<FormattedFactHiringProcessItem[]>(
    [],
  );

  const fetchRecruiters = async () => {
    setRecruiters(await getSuggestionsRecruiter());
  };

  const fetchProcesses = async () => {
    setProcesses(
      await getSuggestionsProcess(selectedRecruiters?.map(r => r.id) ?? []),
    );
  };

  const fetchVacancies = async () => {
    setVacancies(
      await getSuggestionsVacancy(selectedProcesses?.map(p => p.id) ?? []),
    );
  };

  const createFilterBody = (): DashboardFilter => {
    return {
      recruiters: selectedRecruiters?.map(recruiter => recruiter.id) ?? [],
      processes:
        selectedProcesses?.map(hiringProcess => hiringProcess.id) ?? [],
      vacancies: selectedVacancies?.map(vacancy => vacancy.id) ?? [],
      dateRange: {
        startDate: dateStartFilter,
        endDate: dateEndFilter,
      },
      processStatus: selectedProcessStatuses?.map(status => status.id) ?? [],
      vacancyStatus: selectedVacancyStatuses?.map(status => status.id) ?? [],
      page: page,
      pageSize: pageSize,
    };
  };

  const fetchDashboard = async () => {
    const dashboardData = await getDashboardData(createFilterBody());
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
    setTableData(
      (await getDashboardTableData(createFilterBody())).factHiringProcess || [],
    );
  };

  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  const handleFilter = async () => {
    await fetchDashboard();
    await fetchTableData();
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      await Promise.all([
        fetchDashboard(),
        fetchTableData(),
        fetchRecruiters(),
        fetchProcesses(),
        fetchVacancies(),
      ]);
    };

    initializeDashboard();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <MultiSelectFilter
          placeholder={'Recrutadores'}
          getSuggestions={getSuggestionsRecruiters}
          onChange={(selected: Suggestion[]) => setSelectedRecruiters(selected)}
        />
        <MultiSelectFilter
          placeholder={'Processos Seletivos'}
          getSuggestions={getSuggestionsProcesses}
          onChange={(selected: Suggestion[]) => setSelectedProcesses(selected)}
        />
        <MultiSelectFilter
          placeholder={'Vagas'}
          getSuggestions={getSuggestionsVacancies}
          onChange={(selected: Suggestion[]) => setSelectedVacancies(selected)}
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
        <MultiSelectFilter
          placeholder={'Status do Processo'}
          getSuggestions={() => Promise.resolve(vacancyStatuses)}
          onChange={(selected: Suggestion[]) =>
            setSelectedProcessStatuses(selected)
          }
        />
        <MultiSelectFilter
          placeholder={'Status da Vaga'}
          getSuggestions={() => Promise.resolve(processStatuses)}
          onChange={(selected: Suggestion[]) =>
            setSelectedVacancyStatuses(selected)
          }
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
          titleCard="Tempo médio contratação (Dias)"
          valueCard={cardsData?.totalCandidates ?? ''}
        />
      </View>

      <View style={styles.chartSection}>
        <View style={styles.graph}>
          <BarChart data={chartData} />
        </View>
        <View style={styles.pieChart}>
          <PieChart title={'Status das vagas'} data={pieData} />
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
