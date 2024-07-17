import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  const [showMenu, setShowMenu] = useState(false);
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
        const response = await axios.get(`http://192.168.1.15:3000/explorer/${explorer.id}`);
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
        const response = await axios.get(`http://192.168.1.15:3000/explorer/${explorer.id}/posts`);
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

  const navigateToEditProfile = () => {
    navigation.navigate('ExplorerEditProfilScreen');
  };

  const handleLogout = () => {
    logOut();
    navigation.navigate('Login');
  };

  const deleteExplorerPost = async (postId, token) => {
    try {
      const response = await fetch(`http://192.168.1.15:3000/posts/explorer/delete/${postId}`, {
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

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuOption = (option) => {
    setShowMenu(false);
    if (option === 'Home') {
      navigation.navigate('Main');
    } else if (option === 'AddPost') {
      navigation.navigate('ExplorerAddPostScreen');
    }
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
            <Icon name="bars" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowMenu(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('Home')}>
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuOption('AddPost')}>
              <Text style={styles.menuItemText}>Add Post</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
      {activeTab === 'Favourites' && (
        <FlatList
          key="threeColumnsFavourites"
          data={favourites}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderFavouriteItem}
          numColumns={3}
          contentContainerStyle={styles.postsContainer}
        />
      )}
      {activeTab === 'Visited' && (
        <FlatList
          key="threeColumnsVisited"
          data={visited}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderVisitedItem}
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#fff',
    width: 150,
    marginTop: 60,
    marginRight: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItemText: {
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
});

export default ExplorerProfile;