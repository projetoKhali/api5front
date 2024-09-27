import App from "@/src/App";
import { ScrollView } from "react-native";
import { StyleSheet } from 'react-native';
import React from 'react';

export default function Page() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <App/>
    </ScrollView>
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
