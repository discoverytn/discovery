import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const ExplorerProfile = () => {
  const { explorer, setExplorer, logOut } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Posts');
  const [posts, setPosts] = useState([])
  const [numPosts, setNumPosts] = useState(0)
  const [numLikes, setNumLikes] = useState(0)
  const [numTraveled, setNumTraveled] = useState(0);

  useEffect(() => {
    const fetchExplorerData = async () => {
      try {
        const response = await axios.get(`http://192.168.92.72:3000/explorer/${explorer.id}`);
        if (response.status === 200) {
          setExplorer(response.data);
          setNumPosts(response.data.Posts?.length || 0);
          setNumLikes(response.data.Likes || 0);
          setNumTraveled(response.data.Traveled || 0);
        } else {
          console.error('Failed to fetch explorer data');
        }
      } catch (error) {
        console.error('Error fetching explorer data:', error.message);
      }
    };
    if (explorer?.id) {
      fetchExplorerData();
    }
  }, [explorer?.id, setExplorer]);

  useEffect(() => {
    const fetchExplorerPosts = async () => {
      try {
        const response = await axios.get(`http://192.168.92.72:3000/explorer/${explorer.id}/posts`);
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
          console.error('Failed to fetch explorer posts');
          setPosts([]);
          setNumPosts(0);
        }
      } catch (error) {
        console.error('Error fetching explorer posts:', error.message);
        setPosts([]);
        setNumPosts(0);
      }
    };

    if (activeTab === 'Posts' && explorer?.id) {
      fetchExplorerPosts();
    }
  }, [explorer?.id, activeTab]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const navigateToEditProfile = () => {
    navigation.navigate('ExplorerEditProfile');
  };

  const handleLogout = () => {
    logOut();
    navigation.navigate('Login');
  };

  if (!explorer) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Explorer data not available</Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: explorer.image }} style={styles.profileImage} />
        <Text style={styles.nameText}>{explorer.firstname} {explorer.lastname}</Text>
        <Text style={styles.descriptionText}>{explorer.description}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Posts</Text>
            <Text style={styles.statValue}>{numPosts}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Likes</Text>
            <Text style={styles.statValue}>{numLikes}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Traveled</Text>
            <Text style={styles.statValue}>{numTraveled}</Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.labelText}>Governorate:</Text>
            <Text style={styles.valueText}>{explorer.governorate}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.labelText}>Municipality:</Text>
            <Text style={styles.valueText}>{explorer.municipality}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.labelText}>Mobile Number:</Text>
            <Text style={styles.valueText}>{explorer.mobileNum}</Text>
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
          style={[styles.navBarItem, activeTab === 'Posts' && styles.activeTab]}
          onPress={() => handleTabChange('Posts')}
        >
          <Text style={styles.navBarText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBarItem, activeTab === 'Favourites' && styles.activeTab]}
          onPress={() => handleTabChange('Favourites')}
        >
          <Text style={styles.navBarText}>Favourites</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navBarItem, activeTab === 'Visited' && styles.activeTab]}
          onPress={() => handleTabChange('Visited')}
        >
          <Text style={styles.navBarText}>Visited</Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'Posts' && (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderPostItem}
          numColumns={2}
          contentContainerStyle={styles.postsContainer}
        />
      )}
    </View>
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
    width: 80,
    height: 80,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statValue: {
    fontSize: 18,
    color: '#555',
    marginTop: 5,
  },
  infoContainer: {
    width: '100%',
    marginTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelText: {
    fontSize: 16,
    color: '#777',
    fontWeight: 'bold',
  },
  valueText: {
    fontSize: 16,
    color: '#333',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
    marginTop: 10,
  },
  navBarItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  navBarText: {
    fontSize: 18,
    color: '#555',
  },
  postsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  postItem: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    margin: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 5,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  postDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  editButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#dc3545',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ExplorerProfile;
