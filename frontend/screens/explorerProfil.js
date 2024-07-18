import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert, Modal, ScrollView, RefreshControl, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DB_HOST, PORT } from "@env";
import Navbar from './Navbar'; 
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
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const lottieRef = React.useRef(null);
  
  const fetchNumPosts = async () => {
    try {
      const response = await axios.get(`http://${DB_HOST}:${PORT}/explorer/${explorer.id}/numposts`);
      if (response.status === 200) {
        setNumPosts(response.data);
      } else if (response.status === 404) {
        setNumPosts(0);
      }
    } catch (error) {
      console.error('Error fetching number of posts:', error);
      setNumPosts(0);
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.updatedNumPosts) {
        setNumPosts(route.params.updatedNumPosts);
        navigation.setParams({ updatedNumPosts: undefined });
      }
    }, [route.params?.updatedNumPosts])
  );

  useEffect(() => {
    const fetchExplorerData = async () => {
      try {
        const response = await axios.get(`http://${DB_HOST}:${PORT}/explorer/${explorer.id}`);
        if (response.status === 200) {
          const explorerData = response.data;
          setExplorer({ ...explorerData, numOfPosts: explorerData.Posts?.length || 0 });
          setNumLikes(explorerData.Likes || 0);
          setNumTraveled(explorerData.Traveled || 0);
          fetchNumPosts();
        } else {
          console.error('Failed to fetch explorer data');
        }
      } catch (error) {
        console.error('Error fetching explorer data:', error.message);
      }
    };
  
    const fetchExplorerPosts = async () => {
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
          fetchNumPosts();
        } else {
          console.error('Failed to fetch explorer posts');
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching explorer posts:', error.message);
        setPosts([]);
      }
    };

    const fetchExplorerFavourites = async () => {
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
    };

    const fetchExplorerVisited = async () => {
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
    };

    if (explorer?.id) {
      fetchExplorerData();
      fetchExplorerPosts();
      fetchExplorerFavourites();
      fetchExplorerVisited();
    }
  }, [explorer?.id, setExplorer]);

  useEffect(() => {
    if (route.params?.updatedPosts) {
      setPosts(route.params.updatedPosts.map(post => ({
        id: post.idposts,
        title: post.title,
        description: post.description,
        image1: post.image1
      })));
      navigation.setParams({ updatedPosts: undefined });
    }
  }, [route.params?.updatedPosts]);
  
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleLogout = () => {
    logOut();
    navigation.navigate('Login');
  };

  const deleteExplorerPost = async (postId, token) => {
    try {
      const response = await fetch(`http://${DB_HOST}:${PORT}/posts/explorer/delete/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        Alert.alert('Explorer post deleted successfully');
        const updatedPosts = posts.filter(post => post.id !== postId);
        setPosts(updatedPosts);
        setNumPosts(prevNumPosts => prevNumPosts - 1);
        setExplorer(prevExplorer => ({
          ...prevExplorer,
          numOfPosts: prevExplorer.numOfPosts - 1
        }));
      } else {
        console.error('Error:', data);
        Alert.alert(`Error: ${data.message}`);
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

  const generateUsername = (explorer) => {
    if (!explorer) return '';
    return explorer.username ? explorer.username.toLowerCase() : 'user';
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.postItem}>
      <Image source={{ uri: item.image1 }} style={styles.postImage} />
      <Text style={styles.postTitle}>{item.title}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => { deleteExplorerPost(item.id) }}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFavouriteItem = ({ item }) => (
    <View style={styles.postItem}>
      <Image source={{ uri: item.image1 }} style={styles.postImage} />
      <Text style={styles.postTitle}>{item.title}</Text>
      <TouchableOpacity style={styles.heartIcon} onPress={() => deleteExplorerFavourite(item.id)}>
        <Icon name="heart" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  const renderVisitedItem = ({ item }) => (
    <View style={styles.postItem}>
      <Image source={{ uri: item.image1 }} style={styles.postImage} />
      <Text style={styles.postTitle}>{item.title}</Text>
      <TouchableOpacity style={styles.planeIcon} onPress={() => deleteExplorerVisited(item.id)}>
        <Icon name="plane" size={24} color="green" />
      </TouchableOpacity>
    </View>
  );

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
      case 'EditProfile':
        navigation.navigate('ExplorerEditProfilScreen');
        break;
      case 'Logout':
        handleLogout();
        break;
    }
  };

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Refresh your data here
    setRefreshing(false);
  }, []);

  if (!explorer) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Explorer data not available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.fullNameText}>{`${explorer.firstname} ${explorer.lastname}`}</Text>
            <TouchableOpacity style={styles.optionsContainer} onPress={toggleOptions}>
              <LottieView
                ref={lottieRef}
                source={require('../assets/dropdown.json')}
                style={styles.dropdownAnimation}
                loop={false}
              />
            </TouchableOpacity>
          </View>
        </View>
        {isOptionsOpen && (
          <View style={styles.optionsWrapper}>
            <TouchableOpacity style={styles.optionItem} onPress={() => handleOptionSelect('EditProfile')}>
              <Text style={styles.optionText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionItem} onPress={() => handleOptionSelect('Logout')}>
              <Text style={styles.optionText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.profileContainer}>
          <Image source={{ uri: explorer.image }} style={styles.profileImage} />
          <Text style={styles.usernameText}>@{generateUsername(explorer)}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{numPosts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{numFavourites}</Text>
              <Text style={styles.statLabel}>Favourites</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{numVisited}</Text>
              <Text style={styles.statLabel}>Visited</Text>
            </View>
          </View>
          <Text style={styles.descriptionText}>{explorer.description}</Text>
          <TouchableOpacity onPress={toggleUserInfo} style={styles.businessDetailsToggle}>
            <Text style={styles.businessDetailsToggleText}>
              {showUserInfo ? "Hide Info" : "Display Info"}
            </Text>
            <Icon name={showUserInfo ? 'chevron-up' : 'chevron-down'} size={14} color="#333333" />
          </TouchableOpacity>
          {showUserInfo && (
            <View style={styles.userInfoContainer}>
              <Text style={styles.infoText}>Email: {explorer.email}</Text>
              <Text style={styles.infoText}>Location: {explorer.governorate}, {explorer.municipality}</Text>
              <Text style={styles.infoText}>Phone: {explorer.mobileNum}</Text>
            </View>
          )}
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
        <View style={styles.contentContainer}>
          {activeTab === 'Posts' && (
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderPostItem}
              numColumns={3}
              contentContainerStyle={styles.postsContainer}
            />
          )}
          {activeTab === 'Favourites' && (
            <FlatList
              data={favourites}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderFavouriteItem}
              numColumns={3}
              contentContainerStyle={styles.postsContainer}
            />
          )}
          {activeTab === 'Visited' && (
            <FlatList
              data={visited}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderVisitedItem}
              numColumns={3}
              contentContainerStyle={styles.postsContainer}
            />
          )}
        </View>
      </ScrollView>
      <View style={styles.navbarContainer}>
        <Navbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  headerContent: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fullNameText: {
    marginLeft: 95,
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    color: '#001861'
  },
  optionsContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownAnimation: {
    width: 170,
    height: 170,
  },
  optionsWrapper: {
    position: 'absolute',
    top: 83,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 5,
    elevation: 5,
    zIndex: 1000,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#001861',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileImage: {
    marginTop: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  usernameText: {
    fontSize: 18,
    color: '#565656',
    marginBottom: 10,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  descriptionText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
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
    marginRight: 15,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#001861',
  },
  userInfoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    margin: 15,
    elevation: 5,
  },
  infoText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
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
  contentContainer: {
    flex: 1,
    paddingBottom: 60, // Adjust this value to ensure content is not hidden by the navbar
  },
  postsContainer: {
    padding: 1,
  },
  postItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 1,
    maxWidth: '33%',
  },
  postImage: {
    width: '100%',
    height: '80%',
  },
  postTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(220, 53, 69, 0.8)',
    padding: 3,
    borderRadius: 3,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 10,
  },
  heartIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  planeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ExplorerProfile;