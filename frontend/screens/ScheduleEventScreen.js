import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { DB_HOST, PORT } from "@env";

const CLOUDINARY_UPLOAD_PRESET = 'discovery';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dflixnywo/image/upload';

const ScheduleEventScreen = ({ navigation }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventPrice, setEventPrice] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [canPostEvent, setCanPostEvent] = useState(false);
  const [notEligibleReason, setNotEligibleReason] = useState('');
  const [eventImage, setEventImage] = useState(null);

  const { explorer, business } = useAuth();

  useEffect(() => {
    checkEligibility();
  }, [explorer, business]);

  const checkEligibility = () => {
    if (explorer && Object.keys(explorer).length > 0) {
      console.log("Explorer object in schedule:", explorer);
      if (explorer.numOfPosts >= 100) {
        setCanPostEvent(true);
        setNotEligibleReason('');
      } else {
        setCanPostEvent(false);
        setNotEligibleReason(`You are not a business owner, you can't create an event. You currently have ${explorer.numOfPosts} posts.`);
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

  const selectImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const source = { uri: result.assets[0].uri };
        console.log('Selected image URI:', source.uri);
        uploadImage(source.uri);
      }
    } catch (error) {
      console.error('ImagePicker Error: ', error);
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: uri.split("/").pop(),
    });
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const imageUrl = response.data.secure_url;
        setEventImage(imageUrl);
      } else {
        Alert.alert("Error", "Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      Alert.alert("Error", "An error occurred while uploading the image");
    }
  };

  console.log('Business object:', business);
  console.log('Business ID:', business ? business.idbusiness : 'Not available');

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
      eventLocation,
      image: eventImage,
      business_idbusiness: business ? business.idbusiness : null,
    };

    if (explorer && explorer.id) {
      eventData.explorer_idexplorer = explorer.id;
    } else if (business && business.id) {
      eventData.business_idbusiness = business.id;
    }

    try {
      const response = await axios.post(`http://${DB_HOST}:${PORT}/events/create`, eventData);

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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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

          <Text style={styles.label}>Event Location</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEventLocation}
            value={eventLocation}
            placeholder="Enter event location"
          />

          <View style={styles.imagePickerContainer}>
            <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
              {eventImage ? (
                <Image source={{ uri: eventImage }} style={styles.eventImage} />
              ) : (
                <Text style={styles.imagePickerText}>Pick an event image</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={Submit}>
            <Text style={styles.buttonText}>Post Event</Text>
          </TouchableOpacity>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
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
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imagePickerText: {
    color: '#007BFF',
  },
});

export default ScheduleEventScreen;
