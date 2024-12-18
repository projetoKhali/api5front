import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from 'react-native';
import Filter, { FilterRef } from '../components/filter';
import { Suggestion } from '../schemas/Misc';
import {
  getSuggestionsRecruiter,
  getSuggestionsProcess,
  getSuggestionsVacancy,
} from '../service/Suggestions';
import {
  fetchAllPagesData,
  generateCSV,
  getDashboardTableData,
} from '../service/TableDashboard';
import { FormattedFactHiringProcessItem } from '../schemas/TableDashboard';
import { DashboardFilter } from '../schemas/Dashboard';
import DynamicTable from '../components/DynamicTable';
import MultiSelectFilter, {
  MultiSelectFilterRef,
} from '../components/MultiSelectFilter';
import { processStatuses, vacancyStatuses } from '../schemas/Status';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const PAGE_SIZE = 5;

const Report = () => {
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
  const userGroup: number[] | null = useSelector(
    (state: RootState) =>
      state.auth.user?.departments?.map(department => department.id) || null,
  );

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

  const [tableData, setTableData] = useState<FormattedFactHiringProcessItem[]>(
    [],
  );

  const fetchRecruiters = async () => {
    const page = await getSuggestionsRecruiter({
      page: 1,
      pageSize: 20,
      departments: userGroup || [],
    });

    setRecruiters(page.items);
  };

  const fetchProcesses = async () => {
    const page = await getSuggestionsProcess({
      page: 1,
      pageSize: 20,
      ids: selectedRecruiters?.map(r => r.id) ?? [],
      departments: userGroup || [],
    });

    setProcesses(page.items);
  };

  const fetchVacancies = async () => {
    const page = await getSuggestionsVacancy({
      page: 1,
      pageSize: 20,
      ids: selectedProcesses?.map(p => p.id) ?? [],
      departments: userGroup || [],
    });

    setVacancies(page.items);
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
      accessGroup: userGroup ? userGroup : null,
    };
  };

  const fetchTableData = async () => {
    const response = await getDashboardTableData(createFilterBody());

    setTableData(response.items || []);
    setTotalPages(response.numMaxPages || 1);
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      await Promise.all([
        fetchTableData(),
        fetchRecruiters(),
        fetchProcesses(),
        fetchVacancies(),
      ]);
    };

    initializeDashboard();
  }, []);

  useEffect(() => {
    fetchTableData();
  }, [page]);

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
    await fetchTableData();
  };

  const applyFiltersDelayed = async () => {
    if (applyFiltersTimerRef.current) {
      clearTimeout(applyFiltersTimerRef.current);
    }

    setIsLoading(true);

    applyFiltersTimerRef.current = setTimeout(async () => {
      await applyFilters();

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

  const [allData, setAllData] = useState<FormattedFactHiringProcessItem[]>([]);

  const handleExportCSV = async () => {
    setAllData(await fetchAllPagesData(createFilterBody()));
    if (allData.length > 0) {
      generateCSV(allData);
    } else {
      console.warn('Nenhum dado disponível para exportar.');
    }
  };

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
          onChange={(selected: Suggestion[]) => setSelectedRecruiters(selected)}
        />
        <MultiSelectFilter
          ref={processesMultiSelectFilterRef}
          placeholder={'Processos Seletivos'}
          getSuggestions={getSuggestionsProcesses}
          onChange={(selected: Suggestion[]) => setSelectedProcesses(selected)}
        />
        <MultiSelectFilter
          ref={vacanciesMultiSelectFilterRef}
          placeholder={'Vagas'}
          getSuggestions={getSuggestionsVacancies}
          onChange={(selected: Suggestion[]) => setSelectedVacancies(selected)}
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
            setSelectedProcessStatuses(selected)
          }
        />
        <MultiSelectFilter
          ref={vacancyStatusesMultiSelectFilterRef}
          placeholder={'Status da Vaga'}
          getSuggestions={() => processStatuses}
          onChange={(selected: Suggestion[]) =>
            setSelectedVacancyStatuses(selected)
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

        <TouchableOpacity style={styles.button} onPress={handleExportCSV}>
          <Text style={styles.buttonText}>Exportar CSV</Text>
        </TouchableOpacity>
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DCDADA',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  filterSection: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    backgroundColor: '#EDE7E7',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 10,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#F28727',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 5,
    width: '8%',
    minWidth: 120,
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
    display: 'flex',
    width: '100%',
    padding: '1%',
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

export default Report;
