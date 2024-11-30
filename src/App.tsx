import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import Login from './pages/Login';
import { CiMenuBurger } from 'react-icons/ci';

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
            {isSidebarVisible ? (
              <Sidebar closeSidebar={toggleSidebar} />
            ) : (
              <Pressable style={styles.button} onPress={toggleSidebar}>
                <CiMenuBurger />
              </Pressable>
            )}
            <View style={styles.content}>
              <Routes>
                <Route path="/" index element={<Dashboard />} />
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
  button: {
    display: 'flex',
    width: '3%',
    height: '4%',
    backgroundColor: '#F18523',
    position: 'absolute',
    top: '1%',
    left: 10,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    minWidth: 40,
    minHeight: 20,
  },
});
