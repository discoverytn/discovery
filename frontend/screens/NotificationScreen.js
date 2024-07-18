import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { DB_HOST, PORT } from "@env";
import Navbar from './Navbar';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const { explorer, business } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = explorer?.idexplorer || business?.idbusiness;
      const userType = explorer?.idexplorer ? 'explorer' : 'business';
      const response = await axios.get(`http://${DB_HOST}:${PORT}/notifications/user/${userId}?userType=${userType}`);

      setNotifications(response.data);
      const unreadNotifications = response.data.filter(notif => !notif.is_read);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [explorer, business]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications().then(() => setRefreshing(false));
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://${DB_HOST}:${PORT}/notifications/${notificationId}/read`);

      setNotifications(notifications.map(notif => 
        notif.idnotif === notificationId ? { ...notif, is_read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const renderNotificationItem = ({ item }) => {
    const renderMessage = (message, type) => {
      if (type === 'favorite' || type === 'event_join') {
        const parts = message.split(' ');
        return (
          <Text style={styles.notificationText}>
            <Text style={styles.boldText}>{`${parts[0]} ${parts[1]}`}</Text>
            {` ${parts.slice(2).join(' ')}`}
          </Text>
        );
      }
      return <Text style={styles.notificationText}>{message}</Text>;
    };
  
    return (
      <TouchableOpacity 
        style={[styles.notificationItem, !item.is_read && styles.unreadNotification]}
        onPress={() => markAsRead(item.idnotif)}
      >
        <Image 
          source={item.senderImage ? { uri: item.senderImage } : require('../assets/user.jpg')}
          style={styles.notificationImage}
        />
        <View style={styles.notificationContent}>
          {renderMessage(item.message, item.type)}
          <Text style={styles.notificationTime}>{new Date(item.created_at).toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faCircleLeft} style={styles.icon} size={20} color='#fff' />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <FontAwesomeIcon icon={faHome} style={styles.commentActionIcon} size={22} color="#fff"/>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.idnotif.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications yet</Text>
        }
      />
      <Navbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#8e9eef',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  icon: {
    width: 24,
    height: 24,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadBadge: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 5,
  },
  unreadBadgeText: {
    color: '#8e9eef',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 7
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
    marginLeft: 7
  },
  unreadNotification: {
    backgroundColor: '#f0f4ff',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  boldText: {
    fontWeight: 'bold',
  }
});

export default NotificationScreen;