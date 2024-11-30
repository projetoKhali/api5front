import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Button, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import Card from '../components/Card';
import BarChart from '../components/barChart';
import { getDashboardData } from '../service/Dashboard';
import PieChart from '../components/PieChart';
import DynamicTable from '../components/DynamicTable';
import { getDashboardTableData } from '../service/TableDashboard';
import { FormattedFactHiringProcessItem } from '../schemas/TableDashboard';
import {
  DashboardCardsInfo,
  DashboardFilter,
  DashboardVacancyStatus,
} from '../schemas/Dashboard';
import MultiSelectFilter, { MultiSelectFilterRef } from '../components/MultiSelectFilter';
import Filter, { FilterRef } from '../components/filter';
import { PaginatedSuggestionsGetter, Suggestion, SuggestionsGetter } from '../schemas/Misc';
import { getSuggestionsProcess, getSuggestionsRecruiter, getSuggestionsVacancy } from '../service/Suggestions';
import { processStatuses, vacancyStatuses } from '../schemas/Status';

const TABLE_PAGE_SIZE = 5;
const SUGGESTIONS_PAGE_SIZE = 8;

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

  const [selectedRecruiters, setSelectedRecruiters] = useState<Suggestion[]>(
    [],
  );
  const [selectedProcesses, setSelectedProcesses] = useState<Suggestion[]>(
    [],
  );
  const [selectedVacancies, setSelectedVacancies] = useState<Suggestion[]>(
    [],
  );

  const [selectedProcessStatuses, setSelectedProcessStatuses] = useState<
    Suggestion[]
  >([]);
  const [selectedVacancyStatuses, setSelectedVacancyStatuses] = useState<
    Suggestion[]
  >([]);

  const createFetchRecruiters =
    (): PaginatedSuggestionsGetter => async (page: number) =>
      await getSuggestionsRecruiter({
        page,
        pageSize: SUGGESTIONS_PAGE_SIZE,
      });

  const createFetchProcesses =
    (): PaginatedSuggestionsGetter => async (page: number) =>
      await getSuggestionsProcess({
        page,
        pageSize: SUGGESTIONS_PAGE_SIZE,
        ids: selectedRecruiters?.map(r => r.id) ?? [],
      });

  const createFetchVacancies =
    (): PaginatedSuggestionsGetter => async (page: number) =>
      await getSuggestionsVacancy({
        page,
        pageSize: SUGGESTIONS_PAGE_SIZE,
        ids: selectedProcesses?.map(p => p.id) ?? [],
      });

  const [recruiterSuggestionsFunc, setRecruiterSuggestionsFunc] =
    useState<SuggestionsGetter>(createFetchRecruiters);
  const [processSuggestionsFunc, setProcessSuggestionsFunc] =
    useState<SuggestionsGetter>(createFetchProcesses);
  const [vacancySuggestionsFunc, setVacancySuggestionsFunc] =
    useState<SuggestionsGetter>(createFetchVacancies);

  useEffect(() => {
    setRecruiterSuggestionsFunc(createFetchRecruiters);
    setProcessSuggestionsFunc(createFetchProcesses);
    setVacancySuggestionsFunc(createFetchVacancies);
  }, []);

  useEffect(() => {
    recruitersMultiSelectFilterRef?.current?.update?.();
  }, [processesMultiSelectFilterRef]);

  useEffect(() => {
    processesMultiSelectFilterRef?.current?.update?.();
  }, [selectedRecruiters, processesMultiSelectFilterRef]);

  useEffect(() => {
    vacanciesMultiSelectFilterRef?.current?.update?.();
  }, [
    selectedProcesses,
    vacanciesMultiSelectFilterRef,
    processesMultiSelectFilterRef,
  ]);

  const [dateStartFilter, setDateStartFilter] = useState<string>('');
  const [dateEndFilter, setDateEndFilter] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const applyFiltersTimerRef = useRef<NodeJS.Timeout | null>(null);

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
  };

  const applyFiltersDelayed = async () => {
    if (applyFiltersTimerRef.current) {
      clearTimeout(applyFiltersTimerRef.current);
    }

    setIsLoading(true);

    applyFiltersTimerRef.current = setTimeout(async () => {
      recruitersMultiSelectFilterRef.current?.update?.();
      processesMultiSelectFilterRef.current?.update?.();
      vacanciesMultiSelectFilterRef.current?.update?.();

      fetchDashboard();
      fetchTableData();

      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    applyFiltersDelayed();
  }, [
    selectedRecruiters,
    selectedProcesses,
    selectedVacancies,
    dateStartFilter,
    dateEndFilter,
    selectedProcessStatuses,
    selectedVacancyStatuses,
  ]);

  const isAnyFilterActive = () =>
    selectedRecruiters.length > 0 ||
    selectedProcesses.length > 0 ||
    selectedVacancies.length > 0 ||
    dateStartFilter.length > 0 ||
    dateEndFilter.length > 0 ||
    selectedProcessStatuses.length > 0 ||
    selectedVacancyStatuses.length > 0;

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

  const [cardsData, setCardsData] = useState<DashboardCardsInfo | null>(null);

  const [pieData, setPieData] = useState<DashboardVacancyStatus>({
    open: 0,
    analyzing: 0,
    closed: 0,
  });

  const [tableData, setTableData] = useState<FormattedFactHiringProcessItem[]>(
    [],
  );

  const createFilterBody = (): DashboardFilter | null => {
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
      pageSize: TABLE_PAGE_SIZE,
    };
  };

  const fetchDashboard = async () => {
    const filterBody = createFilterBody();
    if (!filterBody) return;

    const dashboardData = await getDashboardData(filterBody);
    const { averageHiringTime, cards, vacancyStatus } = dashboardData;
    const formattedChartData = Object.keys(averageHiringTime).map(month => ({
      month: capitalize(month),
      duration: averageHiringTime[month as keyof typeof averageHiringTime],
    }));

    setChartData(formattedChartData);
    setCardsData(cards);
    setPieData(vacancyStatus);
  };

  const fetchTableData = async () => {
    const filterBody = createFilterBody();
    if (!filterBody) return;
    const response = await getDashboardTableData(filterBody);

    setTableData(response.items || []);
    setTotalPages(response.numMaxPages || 1);
  };

  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  useEffect(() => {
    fetchTableData();
  }, [page]);

  useEffect(() => {
    fetchDashboard();
  }, []);

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
          getSuggestions={recruiterSuggestionsFunc}
          onChange={(selected: Suggestion[]) => setSelectedRecruiters(selected)}
          onClear={() => setSelectedRecruiters([])}
        />
        <MultiSelectFilter
          ref={processesMultiSelectFilterRef}
          placeholder={'Processos Seletivos'}
          getSuggestions={processSuggestionsFunc}
          onChange={(selected: Suggestion[]) => setSelectedProcesses(selected)}
          onClear={() => setSelectedProcesses([])}
        />
        <MultiSelectFilter
          ref={vacanciesMultiSelectFilterRef}
          placeholder={'Vagas'}
          getSuggestions={vacancySuggestionsFunc}
          onChange={(selected: Suggestion[]) => setSelectedVacancies(selected)}
          onClear={() => setSelectedVacancies([])}
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
          getSuggestions={async () => vacancyStatuses}
          onChange={(selected: Suggestion[]) =>
            setSelectedProcessStatuses(selected)
          }
          onClear={() => setSelectedProcessStatuses([])}
        />
        <MultiSelectFilter
          ref={vacancyStatusesMultiSelectFilterRef}
          placeholder={'Status da Vaga'}
          getSuggestions={async () => processStatuses}
          onChange={(selected: Suggestion[]) =>
            setSelectedVacancyStatuses(selected)
          }
          onClear={() => setSelectedVacancyStatuses([])}
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
          valueCard={`${cardsData?.open ?? ''}`}
        />
        <Card
          titleCard="Processos Em Progresso"
          valueCard={`${cardsData?.inProgress ?? ''}`}
        />
        <Card
          titleCard="Processos a Vencer"
          valueCard={`${cardsData?.approachingDeadline ?? ''}`}
        />
        <Card
          titleCard="Processos Encerrados"
          valueCard={`${cardsData?.closed ?? ''}`}
        />
        <Card
          titleCard="Tempo médio contratação (Dias)"
          valueCard={`${cardsData?.averageHiringTime ?? ''}`}
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
