import React from 'react';
import { View, Text} from 'react-native';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory-native';

type DataItem = {
  month: string;
  duration: number;
};

type BarChartProps = {
  data: DataItem[];
};

export default function BarChart({ data }: BarChartProps) {
  return (
    <View style={{ backgroundColor: '#f9f9f9', padding: 20, borderRadius: 10, alignItems: 'center'}}>
       <Text> Tempo médio de contratação (Em dias)</Text>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={20}
      >
        <VictoryAxis
          style={{
            axis: { stroke: "#756f6a" },
            ticks: { stroke: "grey", size: 5 },
            tickLabels: { fontSize: 22, padding: 10, fill: '#333' },
            grid: { stroke: "none" },
          }}
        />
        
        {/* Eixo Y removido */}
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "none" },
            tickLabels: { fill: "none" }, // Remove os rótulos dos ticks
            grid: { stroke: "none" }, // Remove as linhas de grade
          }}
        />

        <VictoryBar 
          data={data.map(item => ({
            month: item.month,
            durationInSeconds: item.duration,
            duration: item.duration.toString()
          }))}
          x="month"
          y="durationInSeconds"
          labels={({ datum }) => datum.duration}
          labelComponent={<VictoryLabel dy={-10} />}
          style={{
            data: { 
              fill: "#F28727",
              width: 40,
              borderRadius: 4,
            },
            labels: { fontSize: 22, fill: '#333' }
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
