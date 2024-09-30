import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory-native';

type DataItem = {
  month: string;
  duration: number;
};

type BarChartProps = {
  data: DataItem[];
};

export default function BarChart({ data }: BarChartProps) {
  const { width } = Dimensions.get('window');

  const labelAngle = width < 400 ? -45 : 0;
  
  return (
    <View style={{ backgroundColor: '#fff', paddingTop: RFPercentage(2), borderRadius: 10, alignItems: 'center', height: '100%', justifyContent: 'center', paddingBottom: RFPercentage(2) }}>
      <Text style={{ fontSize: RFPercentage(1.5) }}> Tempo médio de contratação (Em dias)</Text>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ x: RFPercentage(2), y: RFPercentage(1) }}
        height={RFPercentage(25)}
      >
        <VictoryAxis
          style={{
            axis: { stroke: "#756f6a" },
            ticks: { stroke: "grey", size: 5 },
            tickLabels: {
              fontSize: RFPercentage(1.2),
              fill: '#333',
              angle: labelAngle,
              textAnchor: labelAngle === 0 ? 'middle' : 'end',
            },
            grid: { stroke: "none" },
          }}
        />

        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "none" },
            tickLabels: { fill: "none" },
            grid: { stroke: "none" },
          }}
        />

        <VictoryBar
          data={data.map(item => ({
            month: item.month,
            durationInSeconds: item.duration,
            duration: item.duration.toString().slice(0, 3),
          }))}
          x="month"
          y="durationInSeconds"
          labels={({ datum }) => datum.duration}
          labelComponent={<VictoryLabel dy={-10} />}
          style={{
            data: {
              fill: "#F28727",
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
