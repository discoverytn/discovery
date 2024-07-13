import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DB_HOST, PORT } from "@env";

const ExplorerProfile = ({route}) => {
  const { explorer, setExplorer, logOut } = useAuth();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Posts');
  const [posts, setPosts] = useState([]);
  const [numPosts, setNumPosts] = useState(0);
  const [numLikes, setNumLikes] = useState(0);
  const [numTraveled, setNumTraveled] = useState(0);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  
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
  
    if (explorer?.id) {
      fetchExplorerData();
    }
  }, [explorer?.id, setExplorer]);
  
  useEffect(() => {
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
  
    if (activeTab === 'Posts' && explorer?.id) {
      fetchExplorerPosts();
    }
  }, [explorer?.id, activeTab, route.params?.updatedPosts]);

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

  const navigateToEditProfile = () => {
    navigation.navigate('ExplorerEditProfilScreen');
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

  const generateUsername = (explorer) => {
    if (!explorer) return '';
    return explorer.username ? explorer.username.toLowerCase() : 'user';
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.postItem}>
      <Image source={{ uri: item.image1 }} style={styles.postImage} />
      <TouchableOpacity style={styles.deleteButton} onPress={() => { deleteExplorerPost(item.id), console.log("item", item) }}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleMenuOptionPress = (option) => {
    if (option === 'Home') {
      navigation.navigate('Main');
    } else if (option === 'AddPost') {
      navigation.navigate('ExplorerAddPostScreen');
    }
    setIsMenuVisible(false);
  };

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  if (!explorer) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Explorer data not available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.fullNameText}>{`${explorer.firstname} ${explorer.lastname}`}</Text>
          <TouchableOpacity onPress={toggleMenu} style={styles.menuIcon}>
            <Icon name="bars" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        {isMenuVisible && (
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={() => handleMenuOptionPress('Home')} style={styles.menuOption}>
              <Text style={styles.menuOptionText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuOptionPress('AddPost')} style={styles.menuOption}>
              <Text style={styles.menuOptionText}>Add Post</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.profileContainer}>
        <Image source={{ uri: explorer.image }} style={styles.profileImage} />
        <Text style={styles.usernameText}>@{generateUsername(explorer)}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{numPosts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{numLikes}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{numTraveled}</Text>
            <Text style={styles.statLabel}>Traveled</Text>
          </View>
        </View>
        <Text style={styles.descriptionText}>{explorer.description}</Text>
        <TouchableOpacity onPress={toggleUserInfo} style={styles.toggleInfoButton}>
          <Text style={styles.toggleInfoText}>{showUserInfo ? "Hide Info" : "Display Info"}</Text>
        </TouchableOpacity>
        {showUserInfo && (
          <View style={styles.userInfoContainer}>
            <Text style={styles.infoText}>Email: {explorer.email}</Text>
            <Text style={styles.infoText}>Location: {explorer.governorate}, {explorer.municipality}</Text>
            <Text style={styles.infoText}>Phone: {explorer.mobileNum}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.editButton} onPress={navigateToEditProfile}>
          <Text style={styles.editButtonText}>Edit profile</Text>
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
          key="threeColumns"
          data={posts}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderPostItem}
          numColumns={3}
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
  },
  header: {
    padding: 10,
    marginTop: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  menuIcon: {
    position: 'absolute',
    right: 10,
    padding: 10,
  },
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
  },
  menuOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuOptionText: {
    fontSize: 16,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  usernameText: {
    fontSize: 16,
    color: '#333',
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
  toggleInfoButton: {
    marginBottom: 10,
  },
  toggleInfoText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  userInfoContainer: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#gold',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  logoutButtonText: {
    fontSize: 14,
    color: '#fff',
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
    padding: 1,
  },
  postItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 1,
    maxWidth: '30%',
  },
  postImage: {
    width: '100%',
    height: '100%',
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
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ExplorerProfile;
