import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faCalendarAlt, faClock, faMapMarkerAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import {LinearGradient} from 'expo-linear-gradient';

const OneEventScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <Image
        source={require('../assets/sidibousaid.jpg')}
        style={styles.eventImage}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesomeIcon icon={faChevronLeft} size={24} color="#fff" />
      </TouchableOpacity>
      
      <View style={styles.contentContainer}>
        <Text style={styles.eventTitle}>Mega Hotel Halloween Party</Text>
        
        <View style={styles.ratingContainer}>
          <FontAwesomeIcon icon={faStar} size={16} color="#FFD700" />
          <Text style={styles.ratingText}>Join </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <FontAwesomeIcon icon={faCalendarAlt} size={16} color="#FF6B6B" />
            <Text style={styles.infoText}>31 October, 2019</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesomeIcon icon={faClock} size={16} color="#4ECDC4" />
            <Text style={styles.infoText}>Tuesday, 9pm - 6pm</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesomeIcon icon={faMapMarkerAlt} size={16} color="#45B649" />
            <Text style={styles.infoText}>Ariana 35 rue farhat </Text>
          </View>
        </View>
        <View style={styles.infoContainer2}>
        <Text style={styles.descriptionTitle}>About</Text>
        <Text style={styles.descriptionText}>
          Looking for the Best event to join ?what are you waiting for go ahead and join in the event list the spots are limited !
        </Text>
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
    height: 300,
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 370,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  contentContainer: {
    padding: 20,
    marginTop: -40,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop:15,
    marginBottom: 10,
    textAlign:'center'
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
    backgroundColor: '#f9ffe6',
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
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default OneEventScreen;