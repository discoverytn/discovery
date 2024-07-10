import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPersonWalkingLuggage, faLocationDot, faCalendarDays, faUser } from '@fortawesome/free-solid-svg-icons';
import CustomModal from './CustomModal';
import axios from 'axios';
import join from '../assets/join.gif'
import { useAuth } from '../context/AuthContext';
import { DB_HOST, PORT } from "@env";


const EventListScreen = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { explorer, business } = useAuth();

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
    } else {
      console.log('Explorer information is not available');
      // You might want to show an alert to the user here
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
          <FontAwesomeIcon icon={faLocationDot} size={16} color="#32CD32" />
          <Text style={styles.infoText}>{item.eventLocation}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesomeIcon icon={faCalendarDays} size={16} color="#32CD32" />
          <Text style={styles.infoText}>{item.startDate} - {item.endDate}</Text>
        </View>
        <View style={styles.infoRow}>
          <FontAwesomeIcon icon={faUser} size={16} color="#32CD32" />
          <Text style={styles.infoText}>
            By: {item.Explorer ? item.Explorer.username : item.Business ? item.Business.businessname : 'Unknown'}
          </Text>
        </View>
        <Text style={styles.eventDescription} numberOfLines={2}>{item.eventDescription}</Text>
        <View style={styles.footer}>
          <Text style={styles.eventPrice}>{item.eventPrice} DT</Text>
        <TouchableOpacity style={styles.joinButton} onPress={() => toggleModal(item)}>
  <Image source={join} style={styles.gif} />
</TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/left-arrow.jpg')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerText}></Text>
      </View>
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Available Events </Text>
        <LottieView
          source={require('../assets/sand-clock.json')}
          autoPlay
          loop
          style={styles.sandClockAnimation}
        />
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
        onClose={toggleModal}
        message="Event request was sent!"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FFF0',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  icon: {
    width: 30,
    height: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 1,
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#32CD32',
    textAlign: 'center',
  },
  sandClockAnimation: {
    width: 50,
    height: 50,
  },
  eventsContainer: {
    paddingHorizontal: 20,
  },
  eventItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#333',
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
    color: '#32CD32',
  },
  joinButton: {
    backgroundColor: '#32CD32',
    padding: 2,
    borderRadius: 20,
  },
  gif: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default EventListScreen;
