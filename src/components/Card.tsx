import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface CardProps {
  titleCard: string;
  valueCard: string;
}

const Card = ({ titleCard, valueCard }: CardProps) => {
  const numericValue = parseFloat(valueCard);
  if (isNaN(numericValue)) {
    console.warn('O valor do card não é um número válido:', numericValue);
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

const dynamicFontSizeValue = Math.min(RFPercentage(6), 40);
const dynamicFontSizeTitle = Math.min(RFPercentage(2), 19);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    padding: 5,
    margin: 5,
    height: 120,
    width: '18%',
    minWidth: 150,
    borderRadius: 10,
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  value: {
    fontSize: dynamicFontSizeValue,
    textAlign: 'center',
    color: 'black',
  },

  title: {
    fontSize: dynamicFontSizeTitle,
    textAlign: 'center',
    color: 'black',
    marginTop: 10,
  },
});

export default Card;
