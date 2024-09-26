import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CardProps {
  titleCard: string;
  valueCard: string;
}

const Card = ({ titleCard, valueCard }: CardProps) => {

  const numericValue = parseFloat(valueCard);
  if (isNaN(numericValue)) {
    console.warn('O valor do card não é um número válido');
    return null;
  }

  if (numericValue < 0) {
    console.warn('O valor do card não pode ser menor do que zero');
    return null;
  }

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.value}>{valueCard}</Text>
      <Text style={styles.title}>{titleCard}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    padding: 5,
    margin: 5,
    height: 120,
    width: '18%',
    minWidth: 170,
    borderRadius: 10,
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  value: {
    fontSize: 48,
    textAlign: 'center',
    color: 'black',
  },
  
  title: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    marginTop: 10,
  }
});

export default Card;
