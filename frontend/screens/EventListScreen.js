import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPersonWalkingLuggage } from '@fortawesome/free-solid-svg-icons';
import CustomModal from './CustomModal'; 

const events = [
  { id: 1, name: 'Bouselem', location: 'location.jpg', startDate: '16 July', endDate: '28 July', price: 'Free', image: require('../assets/eljem.jpg') },
  { id: 2, name: 'Matmata', location: 'location.jpg', startDate: '20 Sep', endDate: '29 Sep', price: '20DT', image: require('../assets/camping.jpg') },
  { id: 3, name: 'Hammamet', location: 'location.jpg', startDate: '14 Nov', endDate: '22 Nov', price: '25DT', image: require('../assets/souq.jpg') },
  { id: 4, name: 'Sfax', location: 'location.jpg', startDate: '12 Dec', endDate: '18 Dec', price: 'Free', image: require('../assets/sidibousaid.jpg') },
  { id: 5, name: 'tunis', location: 'location.jpg', startDate: '19 Dec', endDate: '18 Dec', price: 'Free', image: require('../assets/sidibousaid1.jpg') },
];

const EventListScreen = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const renderItem = ({ item }) => (
    <View style={styles.eventItem}>
      <Image source={item.image} style={styles.eventImage} />
      <View style={styles.eventDetails}>
        <View style={styles.eventTitleRow}>
          <Text style={styles.eventName}>{item.name}</Text>
          <Image source={require('../assets/location.jpg')} style={styles.locationIcon} />
        </View>
        <View style={styles.priceAndIconRow}>
          <Text style={styles.eventPrice}>{item.price}</Text>
          <TouchableOpacity style={styles.routeButton} onPress={toggleModal}>
            <FontAwesomeIcon icon={faPersonWalkingLuggage} size={25} color="#007BFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.eventDateRow}>
          <Image source={require('../assets/date.jpg')} style={styles.dateIcon} />
          <Text style={styles.eventDates}>{item.startDate} - {item.endDate}</Text>
        </View>
        <View style={styles.eventJoinedRow}>
          <Image source={require('../assets/user.jpg')} style={styles.userIcon} />
          <Image source={require('../assets/user.jpg')} style={styles.userIcon} />
          <Image source={require('../assets/user.jpg')} style={styles.userIcon} />
          <Text style={styles.joinedText}>9 People Joined</Text>
        </View>
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
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.eventsContainer}
      />
      <CustomModal
        visible={showModal}
        onClose={toggleModal}
        message="Event request was sent ! "
      />
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
    justifyContent: 'space-between', // Ensure proper spacing
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
    marginBottom: 5, // Add margin bottom for spacing
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
     // Adjust flex to take available space
  },
  routeButton: {
    marginRight: 135, // Adjust margin left for spacing
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
    marginRight: -8, // overlap the icons
    borderColor: '#fff',
    borderWidth: 2,
  },
  joinedText: {
    color: 'grey',
    marginLeft: 20, // spacing after overlapped icons
  },
});

export default EventListScreen;
