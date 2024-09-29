import React from 'react';
import { View, StyleSheet } from 'react-native';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <View style={styles.container}>
      <Dashboard/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DCDADA',
    width: '100%',
    minHeight: '100%',
    alignItems: 'center',
  }
});