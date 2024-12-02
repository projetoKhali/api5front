/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Link } from 'react-router-dom';
import { LinearGradient } from 'expo-linear-gradient';
import { GoGraph } from 'react-icons/go';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { LuPanelLeftClose } from 'react-icons/lu';
import { MdGroups2 } from 'react-icons/md';
import { MdAppRegistration } from "react-icons/md";


interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
  const screenWidth = Dimensions.get('window').width;
  const sidebarWidth = screenWidth > 600 ? '20%' : '60%';

  return (
    <LinearGradient
      colors={['#F18523', '#F3AE71']}
      style={[styles.sidebar, { width: sidebarWidth }]}
    >
      <View style={styles.viewButtonClose}>
        <TouchableOpacity onPress={closeSidebar}>
          <LuPanelLeftClose style={styles.closeButton} />
        </TouchableOpacity>
      </View>

      <View style={styles.image}>
        <Image
          source={require('../../assets/images/Logo-pro4tech.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.menu}>
        <Link to="/" onClick={closeSidebar} style={styles.link}>
          <GoGraph size={24} style={styles.icon} />
          <Text style={styles.menuItem}>Dashboard</Text>
        </Link>

        <Link to="/report" onClick={closeSidebar} style={styles.link}>
          <HiOutlineDocumentReport size={24} style={styles.icon} />
          <Text style={styles.menuItem}>Relatório</Text>
        </Link>

        <Link to="/group" onClick={closeSidebar} style={styles.link}>
          <MdGroups2 size={24} style={styles.icon} />
          <Text style={styles.menuItem}>Grupos</Text>
        </Link>

        <Link to="/registration" onClick={closeSidebar} style={styles.link}>
          <MdAppRegistration size={24} style={styles.icon} />
          <Text style={styles.menuItem}>Cadastro</Text>
        </Link>

      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    top: 0,
    left: 0,
    minWidth: 200,
    height: '100%',
    paddingVertical: 30,
    paddingHorizontal: 10,
    zIndex: 10,
  },
  closeButton: {
    color: 'white',
    fontSize: 26,
  },
  viewButtonClose: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  image: {
    width: 140,
    height: 140,
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  menu: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    gap: 20,
    paddingLeft: 20,
  },
  link: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    width: '85%',
    textDecorationLine: 'none',
  },
  menuItem: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  icon: {
    color: 'white',
  },
});

export default Sidebar;
