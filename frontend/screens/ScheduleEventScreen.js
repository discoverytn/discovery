import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Button, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const ScheduleEventScreen = ({ navigation }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventPriceFee, setEventPriceFee] = useState('');

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
//testing in front
  const handleSubmit = () => {
    const eventData = {
      eventName,
      eventDescription,
      eventPriceFee,
      startDate,
      endDate,
    };

   
    console.log('Event Data:', eventData);
    Alert.alert('Event Posted', 'Your event has been posted successfully!');
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
        onChangeText={setEventPriceFee}
        value={eventPriceFee}
        placeholder="Enter event price fee"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
