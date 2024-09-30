import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface PieChartProps {
  title: string;
  aberto: number;
  concluido: number;
  fechado: number;
}

const PieChart = ({ title, aberto, concluido, fechado }: PieChartProps) => {

  if (aberto < 0 || concluido < 0 || fechado < 0) {
    console.warn('Os valores não podem ser menores que zero');
    return null;
  }

  const data = [
    { x: 'Abertos', y: aberto },
    { x: 'Em analise', y: concluido },
    { x: 'Fechados', y: fechado },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
        <VictoryPie
          data={data}
          colorScale={['#4f8ef7', '#f76c5e', '#ffaf42']}
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
    paddingTop: 10
  },
});

export default PieChart;
