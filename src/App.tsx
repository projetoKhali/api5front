import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import Login from './pages/Login';
import { CiMenuBurger } from 'react-icons/ci';
import Group from './pages/Group';
import Registration from './pages/Registration';

export default function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const [isSidebarVisible, setSidebarVisible] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
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
                <Route path="/group" element={<Group />} />
                <Route path="/registration" element={<Registration />} />
              </Routes>
            </View>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
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
