import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Filter from '../components/filter';
import { Suggestion } from '../schemas/Suggestion';
import MultiselectFilter from '../components/MultiselectFilter';
import {
  getSuggestionsRecruiter,
  getSuggestionsProcess,
  getSuggestionsVacancy,
} from '../service/Suggestions';
import { fetchAllPagesData, generateCSV, getDashboardTableData } from '../service/TableDashboard';
import { FormattedDashboardTableRow } from '../schemas/TableDashboard';
import { DashboardFilter } from '../schemas/Dashboard';
import DynamicTable from '../components/DynamicTable';

const Report = () => {
  const [recruiters, setRecruiters] = useState<Suggestion[]>([]);
  const [processes, setProcesses] = useState<Suggestion[]>([]);
  const [vacancies, setVacancies] = useState<Suggestion[]>([]);
  const [dateStartFilter, setDateStartFilter] = useState<string>('');
  const [dateEndFilter, setDateEndFilter] = useState<string>('');
  const [tableData, setTableData] = useState<FormattedDashboardTableRow[]>([]);
  const [allData, setAllData] = useState<FormattedDashboardTableRow[]>([]);
  const [page] = useState<number>(1);
  const [pageSize] = useState<number>(13);


  const fetchRecruiters = async () => {
    setRecruiters(await getSuggestionsRecruiter());
  };

  const fetchProcesses = async () => {
    setProcesses(
      await getSuggestionsProcess(recruiters?.map(recruiter => recruiter.id)),
    );
  };

  const handleExportCSV = async () => {
    await setAllData(await fetchAllPagesData(createFilterBody()))
    if (allData.length > 0) {
      generateCSV(allData); 
    } else {
      console.warn('Nenhum dado disponível para exportar.');
    }
  };

  const fetchVacancies = async () => {
    setVacancies(
      await getSuggestionsVacancy(
        processes?.map(hiringProcess => hiringProcess.id),
      ),
    );
  };

  const handleRecruiterSuggestionsChange = (selectedOptions: Suggestion[]) => {
    setRecruiters(selectedOptions);

    fetchProcesses();
    fetchVacancies();
  };

  const handleProcessSuggestionsChange = (selectedOptions: Suggestion[]) => {
    setProcesses(selectedOptions);

    fetchVacancies();
  };

  const handleVacancySuggestionsChange = (selectedOptions: Suggestion[]) => {
    setVacancies(selectedOptions);
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      await Promise.all([
        fetchTableData(),
        fetchRecruiters(),
        fetchProcesses(),
        fetchVacancies(),
        setAllData(await fetchAllPagesData(createFilterBody()))
      ]);
    };

    initializeDashboard();
  }, []);

  const createFilterBody = (): DashboardFilter => {
    return {
      recruiters: recruiters?.map(recruiter => recruiter.id),
      processes: processes?.map(hiringProcess => hiringProcess.id),
      vacancies: vacancies?.map(vacancy => vacancy.id),
      dateRange: {
        startDate: dateStartFilter,
        endDate: dateEndFilter,
      },
      processStatus: [],
      vacancyStatus: [],
      page: page,
      pageSize: pageSize
    };
  };

  const handleFilter = async () => {
    try {
      await fetchTableData();
      setAllData(await fetchAllPagesData(createFilterBody()))
    } catch (error) {
      console.error('Erro ao aplicar filtro:', error);
    }
  };

  const fetchTableData = async () => {
    try {
      const response = await getDashboardTableData(createFilterBody());

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

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        {[
          {
            title: 'Recrutadores',
            getOptions: () => recruiters,
            onChange: handleRecruiterSuggestionsChange,
          },
          {
            title: 'Processos Seletivos',
            getOptions: () => processes,
            onChange: handleProcessSuggestionsChange,
          },
          {
            title: 'Vagas',
            getOptions: () => vacancies,
            onChange: handleVacancySuggestionsChange,
          },
        ].map((filter, index) => (
          <MultiselectFilter
            key={index}
            placeholder={filter.title}
            getOptions={filter.getOptions}
            onChange={selectedOptions => {
              filter.onChange(selectedOptions);
            }}
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
    width: '8%',
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
    padding: '1%',
    height: '80%'
  },
});

export default Report;
