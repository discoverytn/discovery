import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList ,ScrollView} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const BusinessProfileScreen = () => {
  const { business, setBusiness, logOut } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Business');
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [numPosts, setNumPosts] = useState(0);
  const [numEvents, setNumEvents] = useState(0);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await axios.get(`http://192.168.1.19:3000/business/${business.id}`);
        if (response.status === 200) {
          setBusiness(response.data);
          setNumPosts(response.data.Posts?.length || 0);
          setNumEvents(response.data.Events?.length || 0); 
        } else {
          console.error('Failed to fetch business data');
        }
      } catch (error) {
        console.error('Error fetching business data:', error.message);
      }
    };

    if (business?.id) {
      fetchBusinessData();
    }
  }, [business?.id, setBusiness]);

  useEffect(() => {
    const fetchBusinessPosts = async () => {
      try {
        const response = await axios.get(`http://192.168.1.19:3000/business/${business.id}/posts`);
        if (response.status === 200) {
          const transformedPosts = response.data.map(post => ({
            id: post.id,
            title: post.title,
            description: post.description,
            image1: post.image1
          }));
          setPosts(transformedPosts);
          setNumPosts(transformedPosts.length || 0);
        } else {
          console.error('Failed to fetch business posts');
          setPosts([]);
          setNumPosts(0);
        }
      } catch (error) {
        console.error('Error fetching business posts:', error.message);
        setPosts([]);
        setNumPosts(0);
      }
    };

    const fetchBusinessEvents = async () => {
      try {
        const response = await axios.get(`http://192.168.1.19:3000/business/${business.id}/events`);
        if (response.status === 200) {
          const transformedEvents = response.data.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            date: event.date,
            image: event.image 
          }));
          setEvents(transformedEvents);
          setNumEvents(transformedEvents.length || 0);
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
    };

    if (activeTab === 'Business' && business?.id) {
      fetchBusinessPosts();
    } else if (activeTab === 'Events' && business?.id) {
      fetchBusinessEvents();
    }
  }, [business?.id, activeTab]);

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

  if (!business) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Business data not available</Text>
      </View>
    );
  }

  const renderPostItem = ({ item }) => (
    <View style={styles.postItem}>
      <Image source={{ uri: item.image1 }} style={styles.postImage} />
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postDescription}>{item.description}</Text>
    </View>
  );

  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDescription}>{item.description}</Text>
      <Text style={styles.eventDate}>{item.date}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.nameText}>{`${business.firstname} ${business.lastname}`}</Text>
        <Image source={{ uri: business.image }} style={styles.profileImage} />
        <Text style={styles.usernameText}>{business.username}</Text>
        <Text style={styles.descriptionText}>{business.description}</Text> 
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Posts</Text>
            <Text style={styles.statValue}>{numPosts}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Events</Text>
            <Text style={styles.statValue}>{numEvents}</Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.labelText}>Governorate:</Text>
            <Text style={styles.valueText}>{business.governorate}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.labelText}>Municipality:</Text>
            <Text style={styles.valueText}>{business.municipality}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.labelText}>Mobile Number:</Text>
            <Text style={styles.valueText}>{business.mobileNum}</Text>
          </View>
          {/* Additional Info Section */}
          <View style={styles.additionalInfoContainer}>
            <Text style={styles.additionalInfoLabel}>Business Name:</Text>
            <Text style={styles.additionalInfoValue}>{business.businessName}</Text>
          </View>
          <View style={styles.additionalInfoContainer}>
            <Text style={styles.additionalInfoLabel}>Description:</Text>
            <Text style={styles.additionalInfoValue}>{`${business.businessDesc}`}</Text>
          </View>
          <View style={styles.additionalInfoContainer}>
            <Text style={styles.additionalInfoLabel}>Location:</Text>
            <Text style={styles.additionalInfoValue}>{`${business.governorate}, ${business.municipality}`}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={navigateToEditProfile}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
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
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderPostItem}
          numColumns={2}
          contentContainerStyle={styles.postsContainer}
        />
      )}
      {activeTab === 'Events' && (
        <FlatList
          data={events}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderEventItem}
          contentContainerStyle={styles.eventsContainer}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  usernameText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    lineHeight: 22,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  statBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 80,
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  infoContainer: {
    marginVertical: 10,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  labelText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
    color: '#333',
  },
  valueText: {
    fontSize: 16,
    color: '#555',
  },
  additionalInfoContainer: {
    marginBottom: 5,
  },
  additionalInfoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  additionalInfoValue: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  editButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
  navBarItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3498db',
  },
  navBarText: {
    fontSize: 18,
    color: '#555',
  },
  postsContainer: {
    paddingHorizontal: 10,
  },
  postItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  postImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  postDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 18,
    textAlign: 'center',
  },
  eventsContainer: {
    paddingHorizontal: 10,
  },
  eventItem: {
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 18,
    textAlign: 'center',
  },
  eventDate: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BusinessProfileScreen;
