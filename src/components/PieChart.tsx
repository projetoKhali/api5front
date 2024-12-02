import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { DashboardVacancyStatus } from '../schemas/Dashboard';

interface PieChartProps {
  title: string;
  data: DashboardVacancyStatus;
}

interface FormattedDashboardVacancyStatus {
  Abertos?: number;
  'Em Análise'?: number;
  Fechados?: number;
}

const formatDashboardVacancyStatus = (
  item: DashboardVacancyStatus,
): FormattedDashboardVacancyStatus => ({
  ...(item.open > 0 && { Abertos: Math.max(item.open, 0) }),
  ...(item.analyzing > 0 && { 'Em Análise': Math.max(item.analyzing, 0) }),
  ...(item.closed > 0 && { Fechados: Math.max(item.closed, 0) }),
});

const colors: Record<keyof FormattedDashboardVacancyStatus, string> = {
  Abertos: '#4f8ef7',
  'Em Análise': '#f76c5e',
  Fechados: '#ffaf42',
};

const PieChart = ({ title, data: rawData }: PieChartProps) => {
  const formattedData = formatDashboardVacancyStatus(rawData);

  const data = Object.entries(formattedData).map(([key, value]) => ({
    x: key,
    y: value,
  }));

  const colorScale: string[] = Object.keys(formattedData).map(
    key => colors[key as keyof FormattedDashboardVacancyStatus],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <VictoryPie
        data={data}
        colorScale={colorScale}
        labels={({ datum }) => `${datum.x}: ${datum.y}`}
        width={400}
        height={250}
        labelRadius={100}
        style={{
          labels: { fontSize: 15, fill: 'black' },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: RFPercentage(1.6),
    color: 'black',
    paddingTop: 10,
  },
});

export default PieChart;
