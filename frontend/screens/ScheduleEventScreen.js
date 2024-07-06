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

  const { explorer, business } = useAuth();

  useEffect(() => {
    checkUserEligibility();
  }, [explorer]);

  const checkUserEligibility = async () => {
    if (explorer && explorer.id) {
      try {
        const response = await axios.get(`http://192.168.1.19:3000/explorer/${explorer.id}/numPosts`);
        const numOfPosts = response.data;
        if (numOfPosts < 10) {
          Alert.alert(
            "Not Eligible",
            `You need to have at least 10 posts to schedule an event. You currently have ${numOfPosts} posts.`,
            [{ text: "OK", onPress: () => navigation.navigate('EventList') }]
          );
        }
      } catch (error) {
        console.error("Error fetching explorer's post count:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
        Alert.alert("Error", "Unable to verify eligibility. Please try again later.");
      }
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
    if (explorer && explorer.id) {
      try {
        const response = await axios.get(`http://192.168.1.19:3000/explorer/${explorer.id}/numPosts`);
        const numOfPosts = response.data;
        if (numOfPosts < 10) {
          Alert.alert(
            "Not Eligible",
            `You need to have at least 10 posts to schedule an event. You currently have ${numOfPosts} posts.`,
            [{ text: "OK", onPress: () => navigation.navigate('EventList') }]
          );
          return;
        }
      } catch (error) {
        console.error("Error fetching explorer's post count:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
        Alert.alert("Error", "Unable to verify eligibility. Please try again later.");
        return;
      }
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
      const response = await axios.post('http://192.168.1.19:3000/events/create', eventData);
      console.log('Event Data:', response.data);
      Alert.alert('Success', 'Your event has been posted successfully!');
      navigation.navigate('EventList');
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
});

export default ScheduleEventScreen;
