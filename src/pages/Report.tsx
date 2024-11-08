import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Filter from '../components/filter';
import { Suggestion } from '../schemas/Suggestion';
import {
  getSuggestionsRecruiter,
  getSuggestionsProcess,
  getSuggestionsVacancy,
} from '../service/Suggestions';
import { fetchAllPagesData, generateCSV, getDashboardTableData } from '../service/TableDashboard';
import { FormattedDashboardTableRow } from '../schemas/TableDashboard';
import { DashboardFilter } from '../schemas/Dashboard';
import DynamicTable from '../components/DynamicTable';
import MultiSelectFilter from '../components/MultiselectFilter';
import { processStatuses, vacancyStatuses } from '../schemas/Status';

const Report = () => {
  const [recruiters, setRecruiters] = useState<Suggestion[]>([]);
  const [processes, setProcesses] = useState<Suggestion[]>([]);
  const [vacancies, setVacancies] = useState<Suggestion[]>([]);
  const [tableData, setTableData] = useState<FormattedDashboardTableRow[]>([]);
  const [allData, setAllData] = useState<FormattedDashboardTableRow[]>([]);

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
  const [pageSize] = useState<number>(2);

  const handleExportCSV = async () => {
    await setAllData(await fetchAllPagesData(createFilterBody()))
    if (allData.length > 0) {
      generateCSV(allData); 
    } else {
      console.warn('Nenhum dado disponível para exportar.');
    }
  };

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
      page: page,
      pageSize: pageSize,
      processStatus: selectedProcessStatuses?.map(status => status.id) ?? [],
      vacancyStatus: selectedVacancyStatuses?.map(status => status.id) ?? [],
    };
  };

  const fetchTableData = async () => {
    setTableData(
      (await getDashboardTableData(createFilterBody())) || [],
    );
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

  const handleFilter = async () => {
    try {
      await fetchTableData();
      setAllData(await fetchAllPagesData(createFilterBody()))
    } catch (error) {
      console.error('Erro ao aplicar filtro:', error);
    }
  };

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
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={handleFilter}>Filtrar</Text>
        </TouchableOpacity>

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
    minWidth: 120
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
});

export default Report;
