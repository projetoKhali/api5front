import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Link } from 'react-router-dom';
import { LinearGradient } from 'expo-linear-gradient';
import { GoGraph } from "react-icons/go";
import { GoHome } from "react-icons/go";
import { HiOutlineDocumentReport } from "react-icons/hi";
import Logo from "../../assets/images/Logo-pro4tech.png";

interface SidebarProps {
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
  return (
    <LinearGradient
      colors={['#F18523', '#F3AE71']}
      style={styles.sidebar}
    >
      <View style={styles.viewButtonClose}>
        <TouchableOpacity onPress={closeSidebar}>
          <Text style={styles.closeButton}>X</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.image}>
        <View style={styles.image}>
          <Logo width={100} height={100} />
        </View>
      </View>
      
      <View style={styles.menu}>
        <Link to="/" onClick={closeSidebar} style={styles.link}>
          <GoHome  size={30} style={styles.icon} />
          <Text style={styles.menuItem}>Home Page</Text>
        </Link>

        <Link to="/dashboard" onClick={closeSidebar} style={styles.link}>
          <GoGraph size={30} style={styles.icon} />
          <Text style={styles.menuItem}>Dashboard</Text>
        </Link>

        <Link to="/report" onClick={closeSidebar} style={styles.link}>
          <HiOutlineDocumentReport size={30} style={styles.icon} />
          <Text style={styles.menuItem}>Relatório</Text>
        </Link>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '20%',
    minWidth: 200,
    height: '100%',
    padding: 20,
    zIndex: 10,
  },
  closeButton: {
    color: 'white',
    fontSize: 18,
    textAlign: 'right',
    fontWeight: 'bold'
  },
  menu: {
    marginTop: 50,
    gap: 20,
    alignItems: 'center'
  },
  link: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 15,
    padding: 10,
    width: '70%',
    borderRadius: 8,
    textDecorationLine: 'none',
  },
  menuItem: {
    color: 'white',
    fontSize: 18,
    marginLeft: 15,
    fontWeight: 'bold',
    fontFamily: 'System'
  },
  icon: {
    color: 'white',
  },
  viewButtonClose: {
    width: '100%',
    height: '4%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  image: {
    display: 'flex',
    width: '100%',
    height: '20%'
  }
});

export default Sidebar;
