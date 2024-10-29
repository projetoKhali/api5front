import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface PieChartProps {
  title: string;
  data: {
    abertos: number;
    emAnálise: number;
    fechados: number;
  };
}

const PieChart = ({ title, data }: PieChartProps) => {
  const formattedData = Object.entries(data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      x: key
        .replace(/([A-Z])/g, ' $1')
        .replace(/(^\w|\b[A-Z])/g, char => char.toUpperCase()),
      y: Math.max(value, 0),
    }));

  const colors = {
    abertos: '#4f8ef7',
    emAnálise: '#f76c5e',
    fechados: '#ffaf42',
  };

  const colorsArray = (Object.keys(data) as Array<keyof typeof data>)
    .filter(key => data[key] > 0)
    .map(key => colors[key]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <VictoryPie
        data={formattedData}
        colorScale={colorsArray}
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
