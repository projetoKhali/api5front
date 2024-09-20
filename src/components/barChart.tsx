import React from 'react';
import { View } from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory-native';

const timeToSeconds = (time: string): number => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

type DataItem = {
  month: string;
  duration: string;
};

type BarChartProps = {
  data: DataItem[];
};

export default function BarChart({ data }: BarChartProps) {
  return (
    <View style={{ backgroundColor: '#f9f9f9', padding: 20, borderRadius: 10 }}>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={20}
      >
        {/* Eixo X */}
        <VictoryAxis
          style={{
            axis: { stroke: "#756f6a" },
            ticks: { stroke: "grey", size: 5 },
            tickLabels: { fontSize: 32, padding: 10, fill: '#333' },
            grid: { stroke: "none" },
          }}
        />
        
        {/* Eixo Y removido */}
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "none" }, // Remove o traço do eixo
            tickLabels: { fill: "none" }, // Remove os rótulos dos ticks
            grid: { stroke: "none" }, // Remove as linhas de grade
          }}
        />

        <VictoryBar 
          data={data.map(item => ({
            month: item.month,
            durationInSeconds: timeToSeconds(item.duration),
            duration: item.duration
          }))}
          x="month"
          y="durationInSeconds"
          labels={({ datum }) => datum.duration}
          labelComponent={<VictoryLabel dy={-10} />}
          style={{
            data: { 
              fill: "#F28727",
              width: 50,
              borderRadius: 4,
            },
            labels: { fontSize: 32, fill: '#333' }
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
