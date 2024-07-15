import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot, faCalendarDays, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import join from '../assets/join.gif';
import { useAuth } from '../context/AuthContext';

const EventListScreen = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://192.168.1.15:3000/events/getAll');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const auth = useAuth();
  console.log("Authentication context:", auth);

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents().then(() => setRefreshing(false));
  }, []);

  const handleJoinEvent = async (event) => {
    try {
      await axios.post('http://192.168.1.15:3000/events/join', {
        idexplorer: auth.explorer.idexplorer,
        idbusiness: event.Business.idbusiness,
        idevent: event.idevents,
        eventName: event.eventName
      });
  
      // create a notification for the business
      await axios.post('http://192.168.1.15:3000/notifications/create', {
        type: 'event_join',
        message: `${auth.explorer.username} wants to join your event "${event.eventName}"`,
        explorer_idexplorer: auth.explorer.idexplorer,
        business_idbusiness: event.Business.idbusiness,
        senderImage: auth.explorer.image
      });
  
      setModalMessage('Joining request sent! Waiting for business approval.');
      setShowModal(true);
    } catch (error) {
      console.error('Error sending join request:', error);
      setModalMessage('Error sending join request.');
      setShowModal(true);
    }
  };
  
  const renderItem = ({ item }) => {
    console.log("Event item:", item);

   
    
  
    return (
      <TouchableOpacity 
        style={styles.eventItem}
        onPress={() => handleJoinEvent(item)}
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
            <TouchableOpacity 
              style={styles.joinButton} 
              onPress={() => handleJoinEvent(item)}
            >
              <Image source={join} style={styles.gif} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

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
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#32CD32',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default EventListScreen;
