import App from "@/src/App";
import { View } from "react-native";
import { StyleSheet, Dimensions } from 'react-native';
import React from 'react';

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