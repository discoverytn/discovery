import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const Navbar = ({ navigation }) => {
  const { token } = useAuth();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  }, [token]);

  // If no user is logged in, don't render the navbar
  if (!userRole) {
    return null;
  }

  const renderExplorerNavbar = () => (
    <>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Main')}>
        <Icon name="home" type="font-awesome" color="#fff" size={24} />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Discover')}>
        <Icon name="globe" type="font-awesome" color="#fff" size={24} />
        <Text style={styles.navText}>Explore</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ExplorerAddPostScreen')}>
        <Icon name="plus-square" type="font-awesome" color="#fff" size={24} />
        <Text style={styles.navText}>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Favorites')}>
        <Icon name="heart" type="font-awesome" color="#fff" size={24} />
        <Text style={styles.navText}>Favorites</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('EventList')}>
        <Icon name="calendar" type="font-awesome" color="#fff" size={24} />
        <Text style={styles.navText}>Event</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('RewardShopScreen')}>
        <Icon name="trophy" type="font-awesome" color="#fff" size={24} />
        <Text style={styles.navText}>Rewards</Text>
      </TouchableOpacity>
    </>
  );

  const renderBusinessNavbar = () => (
    <>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Main')}>
          <Icon name="home" type="font-awesome" color="#fff" size={24} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Discover')}>
          <Icon name="globe" type="font-awesome" color="#fff" size={24} />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('BusinessddPostScreen')}>
          <Icon name="plus-square" type="font-awesome" color="#fff" size={24} />
          <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Favorites')}>
          <Icon name="heart" type="font-awesome" color="#fff" size={24} />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ScheduleEvent')}>
          <Icon name="calendar" type="font-awesome" color="#fff" size={24} />
          <Text style={styles.navText}>Event</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('NotificationScreen')}>
        <Icon name="bell" type="font-awesome" color="#fff" size={24} />
        <Text style={styles.navText}>Notif</Text>
      </TouchableOpacity>
      </LinearGradient>
    </>
  );

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.bottomNav}>
      {userRole === 'explorer' ? renderExplorerNavbar() : renderBusinessNavbar()}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default Navbar;