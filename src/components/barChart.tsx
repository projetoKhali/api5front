import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
} from 'victory-native';

type DataItem = {
  month: string;
  duration: number;
};

type BarChartProps = {
  data: DataItem[];
};

const translateMonth = (month: string) => {
  const monthTranslations: { [key: string]: string } = {
    January: 'Janeiro',
    February: 'Fevereiro',
    March: 'Março',
    April: 'Abril',
    May: 'Maio',
    June: 'Junho',
    July: 'Julho',
    August: 'Agosto',
    September: 'Setembro',
    October: 'Outubro',
    November: 'Novembro',
    December: 'Dezembro',
  };
  return monthTranslations[month] || month;
};

export default function BarChart({ data }: BarChartProps) {
  const { width } = Dimensions.get('window');

  const labelAngle = width < 400 ? -45 : 0;

  if (!data || !data.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.chartTitle}>Nenhum dado disponível</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>
        Tempo médio de contratação (Em dias)
      </Text>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ x: RFPercentage(2), y: RFPercentage(1) }}
        height={RFPercentage(25)}
      >
        <VictoryAxis
          style={{
            axis: { stroke: '#756f6a' },
            ticks: { stroke: 'grey', size: 5 },
            tickLabels: {
              fontSize: RFPercentage(1.2),
              fill: '#333',
              angle: labelAngle,
              textAnchor: labelAngle === 0 ? 'middle' : 'end',
            },
            grid: { stroke: 'none' },
          }}
          tickFormat={t => translateMonth(t)}
        />

        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: 'none' },
            tickLabels: { fill: 'none' },
            grid: { stroke: 'none' },
          }}
        />

        <VictoryBar
          data={data.map(item => ({
            month: item.month,
            durationInSeconds: item.duration || 0,
            duration: item.duration.toString().slice(0, 3),
          }))}
          x="month"
          y="durationInSeconds"
          labels={({ datum }) => datum.duration}
          labelComponent={<VictoryLabel dy={-10} />}
          style={{
            data: {
              fill: '#F28727',
              width: RFPercentage(2),
              borderRadius: 4,
            },
            labels: { fontSize: RFPercentage(1.5), fill: '#333' },
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 1000 },
          }}
        />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: RFPercentage(2),
    borderRadius: 10,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    paddingBottom: RFPercentage(2),
  },
  chartTitle: { fontSize: RFPercentage(1.5) },
});
