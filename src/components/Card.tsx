import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface CardProps {
  titleCard: string;
  valueCard: number | string;
}

const Card = ({ titleCard, valueCard }: CardProps) => {
  if (typeof valueCard === 'number' && valueCard < 0) {
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

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    padding: 5,
    margin: 5,
    height: 135,
    width: 175,
    borderRadius: 8,
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    
  },

  value: {
    fontSize: 48,
    fontFamily: 'Inter',
    textAlign: 'center',
    color: '#333',
  },
  
  title: {
    fontSize: 18,
    fontFamily: 'Inter',
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  }
});

export default Card;
