import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Button,
  ActivityIndicator,
} from 'react-native';
import Filter, { FilterRef } from '../components/filter';
import Card from '../components/Card';
import BarChart from '../components/barChart';
import { getDashboardData } from '../service/Dashboard';
import PieChart from '../components/PieChart';
import DynamicTable from '../components/DynamicTable';
import { getDashboardTableData } from '../service/TableDashboard';
import { Suggestion } from '../schemas/Suggestion';
import MultiSelectFilter, {
  MultiSelectFilterRef,
} from '../components/MultiSelectFilter';
import { FormattedFactHiringProcessItem } from '../schemas/TableDashboard';
import {
  getSuggestionsRecruiter,
  getSuggestionsProcess,
  getSuggestionsVacancy,
} from '../service/Suggestions';
import { DashboardFilter } from '../schemas/Dashboard';
import { processStatuses, vacancyStatuses } from '../schemas/Status';

const PAGE_SIZE = 5;

const Dashboard = () => {
  const recruitersMultiSelectFilterRef = useRef<MultiSelectFilterRef>(null);
  const processesMultiSelectFilterRef = useRef<MultiSelectFilterRef>(null);
  const vacanciesMultiSelectFilterRef = useRef<MultiSelectFilterRef>(null);
  const processStatusesMultiSelectFilterRef =
    useRef<MultiSelectFilterRef>(null);
  const vacancyStatusesMultiSelectFilterRef =
    useRef<MultiSelectFilterRef>(null);
  const dateStartFilterRef = useRef<FilterRef>(null);
  const dateEndFilterRef = useRef<FilterRef>(null);

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

  type SuggestionsGetter = () => Suggestion[];
  const [getSuggestionsRecruiters, setGetSuggestionsRecruiters] =
    useState<SuggestionsGetter>(() => () => recruiters);
  const [getSuggestionsProcesses, setGetSuggestionsProcesses] =
    useState<SuggestionsGetter>(() => () => processes);
  const [getSuggestionsVacancies, setGetSuggestionsVacancies] =
    useState<SuggestionsGetter>(() => () => vacancies);

  useEffect(() => {
    setGetSuggestionsRecruiters(() => () => recruiters);
  }, [recruiters]);

  useEffect(() => {
    setGetSuggestionsProcesses(() => () => processes);
  }, [processes]);

  useEffect(() => {
    setGetSuggestionsVacancies(() => () => vacancies);
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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const applyFiltersTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
      fetchTableData();
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
      fetchTableData();
    }
  };

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
      pageSize: PAGE_SIZE,
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
      processOpen: cards.open.toString(),
      processOverdue: cards.inProgress.toString(),
      processCloseToExpiring: cards.approachingDeadline.toString(),
      processClosed: cards.closed.toString(),
      totalCandidates: cards.averageHiringTime.toString(),
    });
    setPieData({
      abertos: vacancyStatus.open,
      emAnálise: vacancyStatus.analyzing,
      fechados: vacancyStatus.closed,
    });
  };

  const fetchTableData = async () => {
    const response = await getDashboardTableData(createFilterBody());

    setTableData(response.factHiringProcess || []);
    setTotalPages(response.numMaxPages || 1);
  };

  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  const clearFilters = async () => {
    if (!isAnyFilterActive()) return;

    setSelectedRecruiters([]);
    setSelectedProcesses([]);
    setSelectedVacancies([]);
    setSelectedProcessStatuses([]);
    setSelectedVacancyStatuses([]);
    setDateStartFilter('');
    setDateEndFilter('');

    recruitersMultiSelectFilterRef.current?.clear();
    processesMultiSelectFilterRef.current?.clear();
    vacanciesMultiSelectFilterRef.current?.clear();
    processStatusesMultiSelectFilterRef.current?.clear();
    vacancyStatusesMultiSelectFilterRef.current?.clear();
    dateStartFilterRef.current?.clear();
    dateEndFilterRef.current?.clear();

    await applyFilters();
  };

  const applyFilters = async () => {
    await fetchDashboard();
    await fetchTableData();
  };

  const baseOnFilterChange = async () => {
    if (applyFiltersTimerRef.current) {
      clearTimeout(applyFiltersTimerRef.current);
    }

    setIsLoading(true);

    applyFiltersTimerRef.current = setTimeout(async () => {
      await applyFilters();

      setIsLoading(false);
    }, 1000);
  };

  const recruitersFilterOnChange = async (selected: Suggestion[]) => {
    setSelectedRecruiters(selected);
    baseOnFilterChange();
  };

  const processesFilterOnChange = async (selected: Suggestion[]) => {
    setSelectedProcesses(selected);
    baseOnFilterChange();
  };

  const vacanciesFilterOnChange = async (selected: Suggestion[]) => {
    setSelectedVacancies(selected);
    baseOnFilterChange();
  };

  const processStatusesFilterOnChange = async (selected: Suggestion[]) => {
    setSelectedProcessStatuses(selected);
    baseOnFilterChange();
  };

  const vacancyStatusesFilterOnChange = async (selected: Suggestion[]) => {
    setSelectedVacancyStatuses(selected);
    baseOnFilterChange();
  };

  const isAnyFilterActive = () =>
    selectedRecruiters.length > 0 ||
    selectedProcesses.length > 0 ||
    selectedVacancies.length > 0 ||
    dateStartFilter.length > 0 ||
    dateEndFilter.length > 0 ||
    selectedProcessStatuses.length > 0 ||
    selectedVacancyStatuses.length > 0;

  useEffect(() => {
    const initializeDashboard = async () => {
      await Promise.all([
        fetchDashboard(),
        fetchTableData(),
        fetchRecruiters(),
        fetchProcesses(),
        fetchVacancies(),
      ]);
      fetchTableData();
    };

    initializeDashboard();
  }, []);

  useEffect(() => {
    fetchTableData(); // Atualiza os dados da tabela ao mudar de página
  }, [page]);

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              opacity: isAnyFilterActive() ? 1 : 0,
            },
          ]}
          disabled={!isAnyFilterActive()}
          accessible={isAnyFilterActive()}
          onPress={clearFilters}
        >
          <Text style={styles.buttonText}>Limpar filtros</Text>
        </TouchableOpacity>
        <MultiSelectFilter
          ref={recruitersMultiSelectFilterRef}
          placeholder={'Recrutadores'}
          getSuggestions={getSuggestionsRecruiters}
          onChange={(selected: Suggestion[]) =>
            recruitersFilterOnChange(selected)
          }
        />
        <MultiSelectFilter
          ref={processesMultiSelectFilterRef}
          placeholder={'Processos Seletivos'}
          getSuggestions={getSuggestionsProcesses}
          onChange={(selected: Suggestion[]) =>
            processesFilterOnChange(selected)
          }
        />
        <MultiSelectFilter
          ref={vacanciesMultiSelectFilterRef}
          placeholder={'Vagas'}
          getSuggestions={getSuggestionsVacancies}
          onChange={(selected: Suggestion[]) =>
            vacanciesFilterOnChange(selected)
          }
        />
        <Filter
          ref={dateStartFilterRef}
          placeholder="Data Inicial"
          type="date"
          onChange={date => setDateStartFilter(date)}
        />
        <Filter
          ref={dateEndFilterRef}
          placeholder="Data Final"
          type="date"
          onChange={date => setDateEndFilter(date)}
        />
        <MultiSelectFilter
          ref={processStatusesMultiSelectFilterRef}
          placeholder={'Status do Processo'}
          getSuggestions={() => vacancyStatuses}
          onChange={(selected: Suggestion[]) =>
            processStatusesFilterOnChange(selected)
          }
        />
        <MultiSelectFilter
          ref={vacancyStatusesMultiSelectFilterRef}
          placeholder={'Status da Vaga'}
          getSuggestions={() => processStatuses}
          onChange={(selected: Suggestion[]) =>
            vacancyStatusesFilterOnChange(selected)
          }
        />
        <View
          style={[
            styles.loading,
            {
              opacity: isLoading ? 1 : 0,
            },
          ]}
        >
          <Text>Carregando...</Text>
          <ActivityIndicator size="small" color={styles.loading.color} />
        </View>
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
          <View style={styles.pagination}>
            <Button
              title="Anterior"
              onPress={handlePreviousPage}
              disabled={page === 1}
            />
            <Text>
              Página {page} de {totalPages}
            </Text>
            <Button
              title="Próxima"
              onPress={handleNextPage}
              disabled={page === totalPages}
            />
          </View>
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
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 10,
  },
  loading: {
    color: '#4f8ef7',
    alignSelf: 'center',
  },
});

export default Dashboard;
