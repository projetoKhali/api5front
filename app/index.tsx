import App from "@/src/App";
import { ScrollView } from "react-native";
import { StyleSheet } from 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/src/redux/store';

export default function Page() {
  return (
    <Provider store={store}>
      <ScrollView contentContainerStyle={styles.container}>
        <App />
      </ScrollView>
    </Provider>
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
