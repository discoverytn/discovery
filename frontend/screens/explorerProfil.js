import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, ScrollView, Alert, Modal, RefreshControl } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { DB_HOST, PORT } from "@env";
import Navbar from './Navbar'; 
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const ExplorerProfile = ({route}) => {
  const { explorer, setExplorer, logOut } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Posts');
  const [posts, setPosts] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [visited, setVisited] = useState([]);
  const [numPosts, setNumPosts] = useState(0);
  const [numLikes, setNumLikes] = useState(0);
  const [numTraveled, setNumTraveled] = useState(0);
  const [numFavourites, setNumFavourites] = useState(0);
  const [numVisited, setNumVisited] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [showExplorerDetails, setShowExplorerDetails] = useState(false);
  const lottieRef = useRef(null);

  const fetchExplorerData = useCallback(async () => {
    if (!explorer?.id) return;
    try {
      const response = await axios.get(`http://${DB_HOST}:${PORT}/explorer/${explorer.id}`);
      if (response.status === 200) {
        const explorerData = response.data;
        setExplorer({ ...explorerData, numOfPosts: explorerData.Posts?.length || 0 });
        setNumLikes(explorerData.Likes || 0);
        setNumTraveled(explorerData.Traveled || 0);
        setNumPosts(explorerData.Posts?.length || 0);
      } else {
        console.error('Failed to fetch explorer data');
      }
    } catch (error) {
      console.error('Error fetching explorer data:', error.message);
    }
  }, [explorer?.id, setExplorer]);

  const fetchExplorerPosts = useCallback(async () => {
    if (!explorer?.id) return;
    try {
      const response = await axios.get(`http://${DB_HOST}:${PORT}/explorer/${explorer.id}/posts`);
      if (response.status === 200) {
        const transformedPosts = response.data.map(post => ({
          id: post.idposts,
          title: post.title,
          description: post.description,
          image1: post.image1
        }));
        setPosts(transformedPosts);
      } else {
        console.error('Failed to fetch explorer posts');
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching explorer posts:', error.message);
      setPosts([]);
    }
  }, [explorer?.id]);

  const fetchExplorerFavourites = useCallback(async () => {
    if (!explorer?.id) return;
    try {
      const response = await axios.get(`http://${DB_HOST}:${PORT}/explorer/${explorer.id}/favourites`);
      if (response.status === 200) {
        const transformedFavourites = response.data.map(fav => ({
          id: fav.posts_idposts,
          title: fav.post_title,
          image1: fav.post_image1
        }));
        setFavourites(transformedFavourites);
        setNumFavourites(transformedFavourites.length);
      } else {
        console.error('Failed to fetch explorer favourites');
        setFavourites([]);
        setNumFavourites(0);
      }
    } catch (error) {
      console.error('Error fetching explorer favourites:', error.message);
      setFavourites([]);
      setNumFavourites(0);
    }
  }, [explorer?.id]);

  const fetchExplorerVisited = useCallback(async () => {
    if (!explorer?.id) return;
    try {
      const response = await axios.get(`http://${DB_HOST}:${PORT}/explorer/${explorer.id}/traveled`);
      if (response.status === 200) {
        const transformedVisited = response.data.map(visit => ({
          id: visit.posts_idposts,
          title: visit.post_title,
          image1: visit.post_image1
        }));
        setVisited(transformedVisited);
        setNumVisited(transformedVisited.length);
      } else {
        console.error('Failed to fetch explorer visited posts');
        setVisited([]);
        setNumVisited(0);
      }
    } catch (error) {
      console.error('Error fetching explorer visited posts:', error.message);
      setVisited([]);
      setNumVisited(0);
    }
  }, [explorer?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchExplorerData();
      fetchExplorerPosts();
      fetchExplorerFavourites();
      fetchExplorerVisited();
    }, [fetchExplorerData, fetchExplorerPosts, fetchExplorerFavourites, fetchExplorerVisited])
  );

  useEffect(() => {
    if (route.params?.updatedExplorerData) {
      setExplorer(route.params.updatedExplorerData);
      setNumPosts(route.params.updatedExplorerData.Posts?.length || 0);
      navigation.setParams({ updatedExplorerData: undefined });
    }
    if (route.params?.updatedPosts) {
      setPosts(route.params.updatedPosts);
      navigation.setParams({ updatedPosts: undefined });
    }
  }, [route.params?.updatedExplorerData, route.params?.updatedPosts, setExplorer, navigation]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleLogout = () => {
    logOut();
    navigation.navigate('Login');
  };

  const deleteExplorerPost = async (postId) => {
    try {
      const response = await fetch(`http://${DB_HOST}:${PORT}/posts/explorer/delete/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${explorer.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        Alert.alert('Explorer post deleted successfully');
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

  const deleteExplorerFavourite = async (postId) => {
    if (!explorer || !explorer.idexplorer) {
      console.error('Explorer ID is undefined');
      Alert.alert('Error: Explorer ID is undefined');
      return;
    }
  
    try {
      const response = await fetch(`http://${DB_HOST}:${PORT}/explorer/${explorer.idexplorer}/favourites/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Favourite post removed successfully');
        const updatedFavourites = favourites.filter(fav => fav.id !== postId);
        setFavourites(updatedFavourites);
        setNumFavourites(updatedFavourites.length);
      } else {
        console.error('Error:', data);
        Alert.alert(`Error: ${data.error || 'Failed to remove favourite'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(`Error: ${error.message}`);
    }
  };
  
  const deleteExplorerVisited = async (postId) => {
    if (!explorer || !explorer.idexplorer) {
      console.error('Explorer ID is undefined');
      Alert.alert('Error: Explorer ID is undefined');
      return;
    }
  
    try {
      const response = await fetch(`http://${DB_HOST}:${PORT}/explorer/${explorer.idexplorer}/traveled/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Visited post removed successfully');
        const updatedVisited = visited.filter(visit => visit.id !== postId);
        setVisited(updatedVisited);
        setNumVisited(updatedVisited.length);
      } else {
        console.error('Error:', data);
        Alert.alert(`Error: ${data.error || 'Failed to remove visited post'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(`Error: ${error.message}`);
    }
  };

  const renderPostItem = ({ item }) => (
    <LinearGradient colors={['#e6e9f0', '#eef1f5']} style={styles.postItem}>
      {item.image1 && <Image source={{ uri: item.image1 }} style={styles.postImage} />}
      <Text style={styles.postTitle}>{item.title || 'Untitled'}</Text>
      <Text style={styles.postDescription}>{item.description || 'No description'}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteExplorerPost(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderFavouriteItem = ({ item }) => (
    <LinearGradient colors={['#e6e9f0', '#eef1f5']} style={styles.postItem}>
      {item.image1 && <Image source={{ uri: item.image1 }} style={styles.postImage} />}
      <Text style={styles.postTitle}>{item.title || 'Untitled'}</Text>
      <TouchableOpacity style={styles.heartIcon} onPress={() => deleteExplorerFavourite(item.id)}>
        <Icon name="heart" size={24} color="red" />
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderVisitedItem = ({ item }) => (
    <LinearGradient colors={['#e6e9f0', '#eef1f5']} style={styles.postItem}>
      {item.image1 && <Image source={{ uri: item.image1 }} style={styles.postImage} />}
      <Text style={styles.postTitle}>{item.title || 'Untitled'}</Text>
      <TouchableOpacity style={styles.planeIcon} onPress={() => deleteExplorerVisited(item.id)}>
        <Icon name="plane" size={24} color="green" />
      </TouchableOpacity>
    </LinearGradient>
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchExplorerData(), fetchExplorerPosts(), fetchExplorerFavourites(), fetchExplorerVisited()])
      .then(() => setRefreshing(false))
      .catch((error) => {
        console.error('Error refreshing data:', error);
        setRefreshing(false);
      });
  }, [fetchExplorerData, fetchExplorerPosts, fetchExplorerFavourites, fetchExplorerVisited]);

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
        navigation.navigate('ExplorerEditProfilScreen');
        break;
      case 'Logout':
        handleLogout();
        break;
    }
  };

  const toggleExplorerDetails = () => {
    setShowExplorerDetails(!showExplorerDetails);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <LinearGradient colors={['#333333', '#e6e9f0', '#eef1f5']} style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image source={require('../assets/profilepic.jpg')} style={styles.profileBackground} />
            <Image source={{ uri: explorer.image }} style={styles.profileImage} />
          </View>
          <Text style={styles.nameText}>{`${explorer.firstname} ${explorer.lastname}`}</Text>
          <Text style={styles.usernameText}>@{explorer.username}</Text>
          <Text style={styles.descriptionText}>{explorer.description}</Text>
          
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
              <Icon name="heart" size={24} color="#333333" />
              <Text style={styles.statValue}>{numFavourites}</Text>
              <Text style={styles.statLabel}>Favourites</Text>
            </View>
            <View style={styles.statBox}>
              <Icon name="plane" size={24} color="#333333" />
              <Text style={styles.statValue}>{numVisited}</Text>
              <Text style={styles.statLabel}>Visited</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.explorerDetailsToggle} onPress={toggleExplorerDetails}>
          <Text style={styles.explorerDetailsToggleText}>
            {showExplorerDetails ? 'Hide Explorer Details' : 'Show Explorer Details'}
          </Text>
          <Icon name={showExplorerDetails ? 'chevron-up' : 'chevron-down'} size={20} color="#333333" />
        </TouchableOpacity>

        {showExplorerDetails && (
          <View style={styles.additionalInfoContainer}>
            <Text style={styles.sectionTitle}>Explorer Details</Text>
            <View style={styles.infoItem}>
              <Icon name="envelope" size={20} color="#6900A3" />
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{explorer.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="map-marker-alt" size={20} color="#6900A3" />
              <Text style={styles.infoLabel}>Location:</Text>
              <Text style={styles.infoValue}>{`${explorer.governorate}, ${explorer.municipality}`}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="phone" size={20} color="#6900A3" />
              <Text style={styles.infoLabel}>Contact:</Text>
              <Text style={styles.infoValue}>{explorer.mobileNum}</Text>
            </View>
          </View>
        )}

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
            keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
            renderItem={renderPostItem}
            numColumns={2}
            contentContainerStyle={styles.postsContainer}
          />
        )}
        {activeTab === 'Favourites' && (
          <FlatList
            data={favourites}
            keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
            renderItem={renderFavouriteItem}
            numColumns={2}
            contentContainerStyle={styles.postsContainer}
          />
        )}
        {activeTab === 'Visited' && (
          <FlatList
            data={visited}
            keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
            renderItem={renderVisitedItem}
            numColumns={2}
            contentContainerStyle={styles.postsContainer}
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
  descriptionText: {
    marginTop: 4,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 0,
    color: '#0d3049',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    margin: 15,
    elevation: 5,
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
    color: '#333333',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  explorerDetailsToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    margin: 15,
    elevation: 5,
  },
  explorerDetailsToggleText: {
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
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  planeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ExplorerProfile;