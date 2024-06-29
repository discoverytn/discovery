import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ScrollView, Alert } from 'react-native';
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
        const response = await axios.get(`http://192.168.1.8:3000/business/${business.id}`);
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
        const response = await axios.get(`http://192.168.1.8:3000/business/${business.id}/posts`);
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
        const response = await axios.get(`http://192.168.1.8:3000/business/${business.id}/events`);
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

  const deleteBusinessPost = async (postId, token) => {
    try {
      const response = await fetch(`http://192.168.1.8:3000/posts/explorer/delete/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        alert('Explorer post deleted successfully');
      } else {
        console.error('Error:', data);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  };
  

  const renderPostItem = ({ item }) => (
    <View style={styles.postItem}>
      <Image source={{ uri: item.image1 }} style={styles.postImage} />
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postDescription}>{item.description}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteBusinessPost(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
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
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  usernameText: {
    fontSize: 16,
    marginBottom: 5,
  },
  descriptionText: {
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  labelText: {
    width: '40%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  valueText: {
    width: '60%',
    fontSize: 16,
  },
  additionalInfoContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  additionalInfoLabel: {
    width: '40%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  additionalInfoValue: {
    width: '60%',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
  },
  navBarItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  navBarText: {
    fontSize: 16,
  },
  postsContainer: {
    paddingHorizontal: 10,
  },
  postItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 5,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventsContainer: {
    paddingHorizontal: 10,
  },
  eventItem: {
    flex: 1,
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 5,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 12,
    color: '#888',
  },
});

export default BusinessProfileScreen;
