import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faCircleLeft, faLocationDot, faCalendarDays, faUser } from '@fortawesome/free-solid-svg-icons';
import CustomModal from './CustomModal';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { DB_HOST, PORT } from "@env";
import MessengerIcon from '../screens/MessageIconsScreen';

const EventListScreen = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const { explorer } = useAuth();
  const [joinButtonClicked, setJoinButtonClicked] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://${DB_HOST}:${PORT}/events/getAll`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents().then(() => setRefreshing(false));
  }, []);

  const toggleModal = async (event) => {
    setShowModal(!showModal);
    if (!showModal && event !== currentEvent) {
      setCurrentEvent(event);
      setJoinButtonClicked(true);

      if (explorer && explorer.idexplorer) {
        try {
          await axios.post(`http://${DB_HOST}:${PORT}/notifications/create`, {
            type: 'event_join',
            message: `${explorer.firstname} ${explorer.lastname} wants to join your event "${event.eventName}"`,
            business_idbusiness: event.business_idbusiness,
            explorer_idexplorer: explorer.idexplorer,
            senderImage: explorer.image
          });
          console.log('Notification sent successfully');
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }
    }
  };

  const navigateToChats = () => {
    if (joinButtonClicked) {
      navigation.navigate('Chats');
    } else {
      alert('Please click on "Join" button first.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventItem}
      onPress={() => navigation.navigate('OneEvent', { event: item })}
    >
      <Image
        source={item.image ? { uri: item.image } : require('../assets/event-placeholder.jpg')}
        style={styles.eventImage}
      />
      <View style={styles.eventDetails}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <View style={styles.infoRow}>
          <FontAwesomeIcon icon={faLocationDot} size={16} color="#8e9eef" />
          <Text style={styles.infoText}>{item.eventLocation}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesomeIcon icon={faCalendarDays} size={16} color="#8e9eef" />
          <Text style={styles.infoText}>{item.startDate} - {item.endDate}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesomeIcon icon={faUser} size={16} color="#8e9eef" />
          <Text style={styles.infoText}>
            By: {item.Explorer ? item.Explorer.username : item.Business ? item.Business.businessname : 'Unknown'}
          </Text>
        </View>
        <Text style={styles.eventDescription} numberOfLines={2}>{item.eventDescription}</Text>
        <View style={styles.footer}>
          <Text style={styles.eventPrice}>{item.eventPrice} DT</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={navigateToChats}>
              <MessengerIcon size={40} color="#8e9eef" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.joinButton} onPress={() => toggleModal(item)}>
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faCircleLeft} size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Available Events</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <FontAwesomeIcon icon={faHome} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.idevents.toString()}
        contentContainerStyle={styles.eventsContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      <CustomModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        message="Event request was sent!"
      />
    </SafeAreaView>
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
  eventsContainer: {
    padding: 15,
  },
  eventItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  eventDetails: {
    padding: 15,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  eventPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8e9eef',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#8e9eef',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginLeft: 10,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EventListScreen;