import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
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
import PageFilterGroup, {
  PageFilterGroupRef,
} from '../components/PageFilterGroup';

const TABLE_PAGE_SIZE = 5;

const Dashboard = () => {
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
      <PageFilterGroup
        ref={pageFilterGroupRef}
        onApplyFilters={() => {
          fetchDashboard();
          fetchTableData();
        }}
      />

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
});

export default Dashboard;
