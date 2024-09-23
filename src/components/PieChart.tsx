import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';

interface PieChartProps {
  title: string;
  aberto: number;
  concluido: number;
  fechado: number;
}

const PieChart = ({title, aberto, concluido, fechado}: PieChartProps) => {
  if (aberto < 0 || concluido < 0 || fechado < 0) {
    console.warn('Os valores não podem ser menores que zero');
    return null;
  }

  const data = [
    { x: 'Aberto', y: aberto },
    { x: 'Concluído', y: concluido },
    { x: 'Fechado', y: fechado },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <VictoryPie
        data={data}
        colorScale={['#4f8ef7', '#f76c5e', '#ffaf42']}
        labels={({ datum }) => `${datum.x}: ${datum.y}`}
        style={{
          labels: { fontSize: 12, fill: '#333' },
        }}
        innerRadius={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
});

export default PieChart;
