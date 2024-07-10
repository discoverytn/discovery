import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faCalendarAlt, faClock, faMapMarkerAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DB_HOST, PORT } from "@env";

const OneEventScreen = ({ route, navigation }) => {
  const event = route.params?.event;
  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: Event data not available</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={event.image ? { uri: event.image } : require('../assets/event-placeholder.jpg')}
        style={styles.eventImage}
      />
   <LinearGradient
  colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
  style={styles.gradient}
/>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('EventList')}>
        <FontAwesomeIcon icon={faChevronLeft} size={24} color="#fff" />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text style={styles.eventTitle}>{event.eventName}</Text>
        
        <View style={styles.ratingContainer}>
          <FontAwesomeIcon icon={faStar} size={16} color="#FFD700" />
          <Text style={styles.ratingText}>Join </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <FontAwesomeIcon icon={faCalendarAlt} size={16} color="#FF6B6B" />
            <Text style={styles.infoText}>
              {event.Business ? event.Business.businessname : (event.Explorer ? event.Explorer.username : 'Unknown')}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesomeIcon icon={faClock} size={16} color="#4ECDC4" />
            <Text style={styles.infoText}>{event.startDate} ➡️ {event.endDate}</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesomeIcon icon={faMapMarkerAlt} size={16} color="#45B649" />
            <Text style={styles.infoText}>{event.eventLocation}</Text>
          </View>
        </View>
        <View style={styles.infoContainer2}>
          <Text style={styles.descriptionTitle}>About 🌐</Text>
          <Text style={styles.descriptionText}>{event.eventDescription}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  eventImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 400,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  contentContainer: {
    padding: 20,
    marginTop: -100,
  },
  eventTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingText: {
    color: '#FFD700',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoContainer2: {
    backgroundColor: '#e9ffe9',
    borderRadius: 15,
    padding: 15,
    marginTop:5,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000fff',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  descriptionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
  backButtonText: {
    color: 'blue',
    fontSize: 16,
  },
});

export default OneEventScreen;