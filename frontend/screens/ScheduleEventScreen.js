import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ScheduleEventScreen = ({ navigation }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventPrice, setEventPrice] = useState('');
  const [canPostEvent, setCanPostEvent] = useState(false);
  const [notEligibleReason, setNotEligibleReason] = useState('');

  const { explorer, business } = useAuth();

  useEffect(() => {
    checkEligibility();
  }, [explorer, business]);

  const checkEligibility = () => {
    if (explorer && Object.keys(explorer).length > 0) {
      console.log("Explorer object in schedule:", explorer);
      if (explorer.numOfPosts >= 5) {
        setCanPostEvent(true);
        setNotEligibleReason('');
      } else {
        setCanPostEvent(false);
        setNotEligibleReason(`You need to have at least 5 posts to schedule an event. You currently have ${explorer.numOfPosts} posts.`);
      }
    } else if (business && Object.keys(business).length > 0) {
      setCanPostEvent(true);
      setNotEligibleReason('');
    } else {
      setCanPostEvent(false);
      setNotEligibleReason('Unable to verify user. Please log in again.');
      navigation.navigate('Login');
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const Submit = async () => {
    if (!canPostEvent) {
      return;
    }

    const eventData = {
      eventName,
      eventDescription,
      eventPrice: parseInt(eventPrice),
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    if (explorer && explorer.id) {
      eventData.explorer_idexplorer = explorer.id;
    } else if (business && business.id) {
      eventData.business_idbusiness = business.id;
    }

    try {
      const response = await axios.post('http://192.168.11.112:3000/events/create', eventData);
      console.log('Event Data:', response.data);
      Alert.alert('Success', 'Your event has been posted successfully!', [
        { text: "OK", onPress: () => navigation.navigate('EventList') }
      ]);
    } catch (error) {
      console.error('Error posting event:', error);
      Alert.alert('Error', 'Failed to post event. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/left-arrow.jpg')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Schedule Event</Text>
        <Image source={require('../assets/notification.jpg')} style={styles.icon} />
      </View>

      {canPostEvent ? (
        <>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
              <Text style={styles.dateText}>Start Date: {startDate.toDateString()}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
            )}

            <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
              <Text style={styles.dateText}>End Date: {endDate.toDateString()}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
              />
            )}
          </View>

          <Text style={styles.label}>Event Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEventName}
            value={eventName}
            placeholder="Enter event name"
          />

          <Text style={styles.label}>Event Description</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEventDescription}
            value={eventDescription}
            placeholder="Enter event description"
          />

          <Text style={styles.label}>Event Price Fee</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEventPrice}
            value={eventPrice}
            placeholder="Enter event price fee"
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.button} onPress={Submit}>
            <Text style={styles.buttonText}>Post Event</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.notEligibleText}>{notEligibleReason}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  icon: {
    width: 30,
    height: 30,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  datePickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 5,
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    marginVertical: 10,
    color: '#007BFF',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#007BFF',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  notEligibleText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
});

export default ScheduleEventScreen;