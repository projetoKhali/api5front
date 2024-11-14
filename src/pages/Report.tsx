import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Button } from 'react-native';
import {
  fetchAllPagesData,
  generateCSV,
  getDashboardTableData,
} from '../service/TableDashboard';
import { FormattedFactHiringProcessItem } from '../schemas/TableDashboard';
import { DashboardFilter } from '../schemas/Dashboard';
import DynamicTable from '../components/DynamicTable';
import PageFilterGroup, {
  PageFilterGroupRef,
} from '../components/PageFilterGroup';

const TABLE_PAGE_SIZE = 5;

const Report = () => {
  const pageFilterGroupRef = useRef<PageFilterGroupRef>(null);

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

  const createFilterBody = (): DashboardFilter | null => {
    if (!pageFilterGroupRef.current) return null;

    const selectedRecruiters = pageFilterGroupRef.current.getRecruiters();
    const selectedProcesses = pageFilterGroupRef.current.getProcesses();
    const selectedVacancies = pageFilterGroupRef.current.getVacancies();
    const selectedProcessStatuses =
      pageFilterGroupRef.current.getProcessStatuses();
    const selectedVacancyStatuses =
      pageFilterGroupRef.current.getVacancyStatuses();
    const dateStartFilter = pageFilterGroupRef.current.getDateStart();
    const dateEndFilter = pageFilterGroupRef.current.getDateEnd();

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

  const fetchTableData = async () => {
    const filterBody = createFilterBody();
    if (!filterBody) return;
    const response = await getDashboardTableData(filterBody);

    setTableData(response.items || []);
    setTotalPages(response.numMaxPages || 1);
  };

  useEffect(() => {
    fetchTableData();
  }, [page]);

  const [allData, setAllData] = useState<FormattedFactHiringProcessItem[]>([]);

  const handleExportCSV = async () => {
    const filterBody = createFilterBody();
    if (!filterBody) return;

    setAllData(await fetchAllPagesData(filterBody));
    if (allData.length > 0) {
      generateCSV(allData);
    } else {
      console.warn('Nenhum dado disponível para exportar.');
    }
  };

  return (
    <View style={styles.container}>
      <PageFilterGroup
        ref={pageFilterGroupRef}
        onApplyFilters={() => {
          fetchTableData();
        }}
      >
        <TouchableOpacity style={styles.button} onPress={handleExportCSV}>
          <Text style={styles.buttonText}>Exportar CSV</Text>
        </TouchableOpacity>
      </PageFilterGroup>

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
