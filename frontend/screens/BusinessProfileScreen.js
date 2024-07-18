import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ScrollView, Alert, RefreshControl } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import { DB_HOST, PORT } from "@env";
import Navbar from './Navbar'; 
import LottieView from 'lottie-react-native';

const BusinessProfileScreen = ({route}) => {
  const { business, setBusiness, logOut } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Business');
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [numPosts, setNumPosts] = useState(0);
  const [numEvents, setNumEvents] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [showBusinessDetails, setShowBusinessDetails] = useState(false);
  const lottieRef = useRef(null);

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
    <LinearGradient colors={['#e6e9f0', '#eef1f5']} style={styles.postItem}>
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

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
    if (lottieRef.current) {
      if (!isOptionsOpen) {
        lottieRef.current.play();
      } else {
        lottieRef.current.reset();
      }
    }
  };

  const handleOptionSelect = (option) => {
    setIsOptionsOpen(false);
    switch (option) {
      case 'Home':
        navigation.navigate('Main');
        break;
      case 'EditProfile':
        navigation.navigate('BusinessEditProfileScreen');
        break;
      case 'Logout':
        handleLogout();
        break;
    }
  };

  const toggleBusinessDetails = () => {
    setShowBusinessDetails(!showBusinessDetails);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
<LinearGradient colors={['#3C1E7F', '#7A5D8E', '#F0F3F7']} style={styles.header}>
<View style={styles.profileImageContainer}>
    <Image source={require('../assets/profilepic.jpg')} style={styles.profileBackground} />
    <Image source={{ uri: business.image }} style={styles.profileImage} />
  </View>
  <Text style={styles.nameText}>{`${business.firstname} ${business.lastname}`}</Text>
  <Text style={styles.usernameText}>@{business.username}</Text>
  <Text style={styles.descriptionText}>{business.description}</Text>
          
          <TouchableOpacity style={styles.optionsContainer} onPress={toggleOptions}>
            <LottieView
              ref={lottieRef}
              source={require('../assets/dropdown.json')}
              style={styles.dropdownAnimation}
              loop={false}
            />
          </TouchableOpacity>
          {isOptionsOpen && (
            <View style={styles.optionsWrapper}>
              <TouchableOpacity style={styles.optionItem} onPress={() => handleOptionSelect('Home')}>
                <Text style={styles.optionText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionItem} onPress={() => handleOptionSelect('EditProfile')}>
                <Text style={styles.optionText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionItem} onPress={() => handleOptionSelect('Logout')}>
                <Text style={styles.optionText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>

        <View style={styles.infoContainer}>
     
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Icon name="image" size={24} color="#333333" />
              <Text style={styles.statValue}>{numPosts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statBox}>
              <Icon name="calendar-alt" size={24} color="#333333" />
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

        <TouchableOpacity style={styles.businessDetailsToggle} onPress={toggleBusinessDetails}>
          <Text style={styles.businessDetailsToggleText}>
            {showBusinessDetails ? 'Hide Business Details' : 'Show Business Details'}
          </Text>
          <Icon name={showBusinessDetails ? 'chevron-up' : 'chevron-down'} size={20} color="#333333" />
        </TouchableOpacity>

        {showBusinessDetails && (
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
        )}

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
      <View style={styles.navbarContainer}>
        <Navbar navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollView: {
    flex: 1,
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
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
  },
  profileBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    position: 'absolute',
    top: 10,
    left: 10,
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
    fontSize: 17,
    color: '#59dae2',
    fontWeight: 'bold',
  },
  optionsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownAnimation: {
    marginTop: 50,
    width: 170,
    height: 170,
  },
  optionsWrapper: {
    position: 'absolute',
    top: 64,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 5,
    elevation: 5,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#1a2a6c',
  },
  infoContainer: {
    marginTop:-10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    margin: 15,
    elevation: 5,
  },
  descriptionText: {
    marginTop:4,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 0,
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
    color: '#3333333',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  businessDetailsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    margin: 15,
    elevation: 5,
  },
  businessDetailsToggleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
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
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navBarItem: {
    paddingVertical: 15,
    flex: 1,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  navBarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 80,
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
    color: '#000000',
    marginBottom: 5,
  },
  postDescription: {
    fontSize: 14,
    color: '#000000',
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
    paddingBottom: 80,
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
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default BusinessProfileScreen;