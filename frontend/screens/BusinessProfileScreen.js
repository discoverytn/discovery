import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ScrollView, Alert, RefreshControl } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import { DB_HOST, PORT } from "@env";

const BusinessProfileScreen = ({route}) => {
  const { business, setBusiness, logOut } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Business');
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [numPosts, setNumPosts] = useState(0);
  const [numEvents, setNumEvents] = useState(0);
  const [selectedValue, setSelectedValue] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchBusinessData = useCallback(async () => {
    if (!business?.id) return;
    try {
      const response = await axios.get(`http://${DB_HOST}:${PORT}/business/${business.id}`);
      if (response.status === 200) {
        setBusiness(response.data);
        setNumPosts(response.data.Posts?.length || 0);
        setNumEvents(response.data.numOfEvents || 0);
      } else {
        console.error('Failed to fetch business data');
      }
    } catch (error) {
      console.error('Error fetching business data:', error.message);
    }
  }, [business?.id, setBusiness]);

  const fetchBusinessPosts = useCallback(async () => {
    if (!business?.id) return;
    try {
      const response = await axios.get(`http://${DB_HOST}:${PORT}/business/${business.id}/posts`);
      if (response.status === 200) {
        const transformedPosts = response.data.map(post => ({
          id: post.idposts,
          title: post.title,
          description: post.description,
          image1: post.image1
        }));
        setPosts(transformedPosts);
      } else {
        console.error('Failed to fetch business posts');
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching business posts:', error.message);
      setPosts([]);
    }
  }, [business?.id]);

  const fetchBusinessEvents = useCallback(async () => {
    if (!business?.id) return;
    try {
      const response = await axios.get(`http://${DB_HOST}:${PORT}/events/user/${business.id}?userType=business`);
      if (response.status === 200) {
        const transformedEvents = response.data.map(event => ({
          id: event.idevents,
          eventName: event.eventName,
          startDate: event.startDate,
          endDate: event.endDate,
          eventLocation: event.eventLocation,
          image: event.image
        }));
        setEvents(transformedEvents);
        setNumEvents(transformedEvents.length);
      } else {
        console.error('Failed to fetch business events');
        setEvents([]);
        setNumEvents(0);
      }
    } catch (error) {
      console.error('Error fetching business events:', error.message);
      setEvents([]);
      setNumEvents(0);
    }
  }, [business?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchBusinessData();
      fetchBusinessPosts();
      fetchBusinessEvents();
    }, [fetchBusinessData, fetchBusinessPosts, fetchBusinessEvents])
  );

  useEffect(() => {
    if (route.params?.updatedBusinessData) {
      setBusiness(route.params.updatedBusinessData);
      setNumPosts(route.params.updatedBusinessData.Posts?.length || 0);
      setNumEvents(route.params.updatedBusinessData.numOfEvents || 0);
      navigation.setParams({ updatedBusinessData: undefined });
    }
    if (route.params?.updatedPosts) {
      setPosts(route.params.updatedPosts);
      navigation.setParams({ updatedPosts: undefined });
    }
    if (route.params?.updatedEvents) {
      setEvents(route.params.updatedEvents);
      setNumEvents(route.params.updatedEvents.length);
      navigation.setParams({ updatedEvents: undefined });
    }
  }, [route.params?.updatedBusinessData, route.params?.updatedPosts, route.params?.updatedEvents, setBusiness, navigation]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const navigateToEditProfile = () => {
    navigation.navigate('BusinessEditProfileScreen');
  };

  const handleLogout = () => {
    logOut();
    navigation.navigate('Login');
  };

  const deleteBusinessPost = async (postId) => {
    try {
      const response = await fetch(`http://${DB_HOST}:${PORT}/posts/business/delete/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${business.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        Alert.alert('Business post deleted successfully');
        setPosts(posts.filter(post => post.id !== postId));
        setNumPosts(prevNumPosts => prevNumPosts - 1);
      } else {
        console.error('Error:', data);
        Alert.alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(`Error: ${error.message}`);
    }
  };

  const handlePickerChange = (value) => {
    setSelectedValue(value);
    if (value === 'Home') {
      navigation.navigate('Main');
    } else if (value === 'AddPost') {
      navigation.navigate('BusinessAddPostScreen');
    } else if (value === 'AddEvent') {
      navigation.navigate('ScheduleEvent');
    }
  };

  const deleteBusinessEvent = async (eventId) => {
    try {
      const response = await fetch(`http://${DB_HOST}:${PORT}/events/${eventId}/del`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${business.token}`,
        },
      });

      if (response.ok) {
        const text = await response.text();
        let data;
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.warn('Response is not JSON:', text);
          }
        }

        console.log('Event deleted successfully');
        Alert.alert('Success', 'Event deleted successfully');
        setEvents(events.filter(event => event.id !== eventId));
        setNumEvents(prevNumEvents => prevNumEvents - 1);
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        Alert.alert('Error', `Failed to delete event. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      Alert.alert('Error', `Failed to delete event: ${error.message}`);
    }
  };

  const renderPostItem = ({ item }) => (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.postItem}>
      {item.image1 && <Image source={{ uri: item.image1 }} style={styles.postImage} />}
      <Text style={styles.postTitle}>{item.title || 'Untitled'}</Text>
      <Text style={styles.postDescription}>{item.description || 'No description'}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteBusinessPost(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderEventItem = ({ item }) => (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.eventItem}>
      {item.image && <Image source={{ uri: item.image }} style={styles.eventImage} />}
      <Text style={styles.eventName}>{item.eventName || 'Untitled Event'}</Text>
      <Text style={styles.eventDate}>Start: {new Date(item.startDate).toLocaleDateString()}</Text>
      <Text style={styles.eventDate}>End: {new Date(item.endDate).toLocaleDateString()}</Text>
      <Text style={styles.eventLocation}>{item.eventLocation || 'No location specified'}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteBusinessEvent(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchBusinessData(), fetchBusinessPosts(), fetchBusinessEvents()])
      .then(() => setRefreshing(false))
      .catch((error) => {
        console.error('Error refreshing data:', error);
        setRefreshing(false);
      });
  }, [fetchBusinessData, fetchBusinessPosts, fetchBusinessEvents]);

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient colors={['#1a2a6c', '#e6e9f0', '#eef1f5']} style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: business.image }} style={styles.profileImage} />
        </View>
        <Text style={styles.nameText}>{`${business.firstname} ${business.lastname}`}</Text>
        <Text style={styles.usernameText}>@{business.username}</Text>
        <Text style={styles.vipText}>VIP Business</Text>
        
        <View style={styles.pickerContainer}>
          <Icon name="bars" size={20} color="#FFFFFF" style={styles.pickerIcon} />
          <Picker
            selectedValue={selectedValue}
            onValueChange={handlePickerChange}
            style={styles.picker}
            mode="dropdown"
            dropdownIconColor="#FFFFFF"
          >
            <Picker.Item label="Select an option" value="" color="#000000" />
            <Picker.Item label="Home" value="Home" color="#000000" />
            <Picker.Item label="Add Post" value="AddPost" color="#000000" />
            <Picker.Item label="Add Event" value="AddEvent" color="#000000" />
          </Picker>
        </View>
      </LinearGradient>

      <View style={styles.infoContainer}>
        <Text style={styles.descriptionText}>{business.description}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Icon name="chart-line" size={24} color="#6900A3" />
            <Text style={styles.statValue}>{numPosts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="calendar-alt" size={24} color="#6900A3" />
            <Text style={styles.statValue}>{numEvents}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statBox}>
            <Image source={require('../assets/vipstar2.gif')} style={styles.vipstar} />
            <Text style={styles.statValue}>VIP</Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </View>
      </View>

      <View style={styles.additionalInfoContainer}>
        <Text style={styles.sectionTitle}>Business Details</Text>
        <View style={styles.infoItem}>
          <Icon name="building" size={20} color="#6900A3" />
          <Text style={styles.infoLabel}>Business Name:</Text>
          <Text style={styles.infoValue}>{business.businessName}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="map-marker-alt" size={20} color="#6900A3" />
          <Text style={styles.infoLabel}>Location:</Text>
          <Text style={styles.infoValue}>{`${business.governorate}, ${business.municipality}`}</Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="phone" size={20} color="#6900A3" />
          <Text style={styles.infoLabel}>Contact:</Text>
          <Text style={styles.infoValue}>{business.mobileNum}</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={navigateToEditProfile}>
          <Icon name="edit" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <Icon name="sign-out-alt" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navBarItem, activeTab === 'Business' && styles.activeTab]}
          onPress={() => handleTabChange('Business')}
        >
          <Text style={styles.navBarText}>Business Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBarItem, activeTab === 'Events' && styles.activeTab]}
          onPress={() => handleTabChange('Events')}
        >
          <Text style={styles.navBarText}>Events</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Business' && (
      <FlatList
        data={posts}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        renderItem={renderPostItem}
        numColumns={2}
        contentContainerStyle={styles.postsContainer}
      />
      )}
       {activeTab === 'Events' && (
        <FlatList
          data={events}
          keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
          renderItem={renderEventItem}
          numColumns={2}
          contentContainerStyle={styles.eventsContainer}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFD700',
  },
  crownIcon: {
    position: 'absolute',
    top: -49,
    right: -27,
    width: 182, 
    height: 220, 
  },
  vipstar: {
    width: 48,  
    height: 28, 

  },
  
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d3049',
    marginBottom: 5,
  },
  usernameText: {
    fontSize: 18,
    color: '#0d3049',
    marginBottom: 5,
  },
  vipText: {
    fontSize: 16,
    color: '#5b12d2',
    fontWeight: 'bold',
  },
  pickerContainer: {
    width:170,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    backgroundColor: '#333',
  },
  pickerIcon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
    color: '#FFFFFF',

  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    margin: 15,
    elevation: 5,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a2a6c',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  additionalInfoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    margin: 15,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a2a6c',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    width: '30%',
  },
  infoValue: {
    fontSize: 16,
    flex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2a6c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 5,
  },
  navBarItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#FFD700',
  },
  navBarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a2a6c',
  },
  postsContainer: {
    paddingHorizontal: 10,
  },
  postItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 15,
    elevation: 5,
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  postDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventsContainer: {
    paddingHorizontal: 10,
  },
  eventItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 15,
    elevation: 5,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 3,
  },
  eventLocation: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default BusinessProfileScreen;