import App from "@/src/App";
import { LogBox, View } from "react-native";
import { StyleSheet, Dimensions } from 'react-native';
import React from 'react';

LogBox.ignoreLogs([
  'accessibilityHint', // Especifica o texto do warning para ignorar
]);


export default function Page() {
  return (
    <View style={styles.container}>
      <App/>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DCDADA',
    width: width,
    height: height,
    alignItems: 'center',
  }
});