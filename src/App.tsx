import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import Report from './pages/Report';
import Login from './pages/Login';
import { CiMenuBurger } from "react-icons/ci";

export default function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleLogin = () => {
    setAuthenticated(true);
  };

  return (
    <Router>
      <View style={styles.container}>
        {isAuthenticated ? (
          <>
            { !isSidebarVisible && (
              <View style={styles.buttonBackground}>
                <TouchableOpacity style={styles.button} onPress={toggleSidebar}>
                  <CiMenuBurger />
                </TouchableOpacity>
              </View>
            )}
            {isSidebarVisible && <Sidebar closeSidebar={toggleSidebar} />}
            <View style={styles.content}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/report" element={<Report />} />
              </Routes>
            </View>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
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
  buttonBackground: {
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
    minWidth: 40,
    minHeight: 20
  },
  button: {
    backgroundColor: '#F18523'
  },
});
