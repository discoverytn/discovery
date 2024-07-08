import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPersonWalkingLuggage } from '@fortawesome/free-solid-svg-icons';
import CustomModal from './CustomModal';
import axios from 'axios';

const EventListScreen = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://192.168.1.19:3000/events/getAll');
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

  const toggleModal = () => setShowModal(!showModal);

  const renderItem = ({ item }) => (
    <View style={styles.eventItem}>
      <Image source={require('../assets/event-placeholder.jpg')} style={styles.eventImage} />
      <View style={styles.eventDetails}>
        <View style={styles.eventTitleRow}>
          <Text style={styles.eventName}>{item.eventName}</Text>
          <Image source={require('../assets/location.jpg')} style={styles.locationIcon} />
        </View>
        <View style={styles.priceAndIconRow}>
          <Text style={styles.eventPrice}>{item.eventPrice} DT</Text>
          <TouchableOpacity style={styles.routeButton} onPress={toggleModal}>
            <FontAwesomeIcon icon={faPersonWalkingLuggage} size={25} color="#007BFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.eventDateRow}>
          <Image source={require('../assets/date.jpg')} style={styles.dateIcon} />
          <Text style={styles.eventDates}>{item.startDate} - {item.endDate}</Text>
        </View>
        <Text style={styles.eventDescription}>{item.eventDescription}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/left-arrow.jpg')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Event Lists</Text>
      </View>
      <Text style={styles.subHeaderText}>Available Events</Text>
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
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('ScheduleEvent')}
      >
        <Text style={styles.addButtonText}>+ Add Event</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 100,
    marginTop: 20,
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  eventsContainer: {
    paddingHorizontal: 10,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  eventImage: {
    width: 130,
    height: 130,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  eventDetails: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between', 
  },
  eventTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationIcon: {
    width: 20,
    height: 20,
  },
  priceAndIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5, 
  },
  eventPrice: {
    fontSize: 14,
    color: '#007BFF',
    backgroundColor: '#E0F7FA',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  routeButton: {
    marginRight: 135, 
  },
  eventDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  dateIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  eventDates: {
    color: 'grey',
  },
  eventJoinedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  userIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: -8,
    borderColor: '#fff',
    borderWidth: 2,
  },
  joinedText: {
    color: 'grey',
    marginLeft: 20, 
  },
  eventDescription: {
    color: 'grey',
    marginTop: 5,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 30,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventListScreen;