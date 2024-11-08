import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import Report from './pages/Report';
import { CiMenuBurger } from "react-icons/ci";


export default function App() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <Router>
      <View style={styles.container}>
      { !isSidebarVisible && (
          <View style={styles.buttonBackground}>
            <TouchableOpacity style={styles.button} onPress={toggleSidebar}>
              <CiMenuBurger />
            </TouchableOpacity>
          </View>
        )}
      {isSidebarVisible && (
          <Sidebar closeSidebar={toggleSidebar} />
        )}
        <View style={styles.content}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </View>
      </View>
    </Router>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#DCDADA',
    width: '100%',
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  buttonBackground:{
    display: "flex",
    width: "3%",
    height: "4%",
    backgroundColor: '#F18523',
    position: 'absolute',
    top: '1%',
    left: 10,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    minWidth: 10,
    minHeight: 20
  },
  button: {
    backgroundColor: '#F18523'
  },
});

