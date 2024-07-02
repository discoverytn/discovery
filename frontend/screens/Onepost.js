import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faPaperPlane, faCloudSunRain, faStar, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; 
import { useAuth } from '../context/AuthContext';

const OnepostScreen = ({ route }) => {
  const [postData, setPostData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isTraveled, setIsTraveled] = useState(false); 
  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const scrollViewRef = useRef(null);
  const { explorer } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (route.params) {
      const { postId, postDetails } = route.params;
      setPostData({ postId, postDetails });
      setSelectedImage(postDetails.image.uri);
      checkIfPostFavorited(postId);
      checkIfPostTraveled(postId); 
    }
  }, [route.params]);

  const checkIfPostFavorited = async (postId) => {
    try {
      const idexplorer = explorer.idexplorer;
      const response = await axios.get(`http://192.168.100.3:3000/explorer/${idexplorer}/favourites/${postId}/check`);

      setIsFavorited(response.data.favorited);
    } catch (error) {
      console.error('Error checking if post is favorited:', error);
    }
  };

  const checkIfPostTraveled = async (postId) => {
    try {
      const idexplorer = explorer.idexplorer;
      const response = await axios.get(`http://192.168.100.3:3000/explorer/${idexplorer}/traveled/${postId}/check`);

      setIsTraveled(response.data.traveled);
    } catch (error) {
      console.error('Error checking if post is traveled:', error);
    }
  };

  if (!postData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Onepost</Text>
        <Text style={styles.noPostsText}>No post selected yet !</Text>
      </View>
    );
  }

  const { postId, postDetails } = postData;
  const { name, location, image, image2, image3, image4, description } = postDetails;

  const shortDescription = description.slice(0, 100) + '...';

  const addToFavorites = async () => {
    try {
      const idexplorer = explorer.idexplorer;
      const response = await axios.post(`http://192.168.100.3:3000/explorer/${idexplorer}/favourites/${postId}/addOrRemove`, {
        idposts: postId,
      });

      if (response.data.message === "Post added to favorites") {
        setIsFavorited(true);
        Alert.alert('Success', 'Post added to favorites');
      } else if (response.data.message === "Post removed from favorites") {
        setIsFavorited(false);
        Alert.alert('Success', 'Post removed from favorites');
      } else {
        Alert.alert('Error', 'Unexpected response from server');
      }
    } catch (error) {
      console.error('Error adding/removing post to/from favorites:', error);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const addToTraveled = async () => {
    try {
      const idexplorer = explorer.idexplorer;
      const response = await axios.post(`http://192.168.100.3:3000/explorer/${idexplorer}/traveled/${postId}/addOrRemove`, {
        idposts: postId,
      });

      if (response.data.message === "Post added to traveled") {
        setIsTraveled(true);
        Alert.alert('Success', 'Post added to traveled');
      } else if (response.data.message === "Post removed from traveled") {
        setIsTraveled(false);
        Alert.alert('Success', 'Post removed from traveled');
      } else {
        Alert.alert('Error', 'Unexpected response from server');
      }
    } catch (error) {
      console.error('Error adding/removing post to/from traveled:', error);
      Alert.alert('Error', 'Failed to update traveled');
    }
  };

  const handleScrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const handleSendPost = () => {
    addToTraveled(); 
  };

  const handleImagePress = (imageUri) => {
    setSelectedImage(imageUri);
    handleScrollToTop();
  };

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: selectedImage }} style={styles.mainImage} />
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={addToFavorites} style={styles.iconContainer}>
            <FontAwesomeIcon
              icon={faHeart}
              style={[styles.icon, isFavorited ? styles.favoriteIconActive : styles.favoriteIconInactive]}
              size={26}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSendPost} style={styles.iconContainer}>
            <FontAwesomeIcon
              icon={faPaperPlane}
              style={[styles.icon, isTraveled ? styles.traveledIconActive : styles.traveledIconInactive]}
              size={26}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.thumbnailContainer}>
          {image2 && (
            <TouchableOpacity onPress={() => handleImagePress(image2.uri)}>
              <Image source={{ uri: image2.uri }} style={styles.thumbnail} />
            </TouchableOpacity>
          )}
          {image3 && (
            <TouchableOpacity onPress={() => handleImagePress(image3.uri)}>
              <Image source={{ uri: image3.uri }} style={styles.thumbnail} />
            </TouchableOpacity>
          )}
          {image4 && (
            <TouchableOpacity onPress={() => handleImagePress(image4.uri)}>
              <Image source={{ uri: image4.uri }} style={styles.thumbnail} />
            </TouchableOpacity>
          )}
          {selectedImage !== image.uri && (
            <TouchableOpacity onPress={() => handleImagePress(image.uri)}>
              <Image source={{ uri: image.uri }} style={styles.thumbnail} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{name}</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Image source={require('../assets/location.jpg')} style={styles.infoIcon} />
            <Text style={styles.infoText}>{location}</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesomeIcon icon={faCloudSunRain} style={styles.weatherIcon} size={32} />
            <Text style={styles.infoText}>25°C</Text>
          </View>
          <View style={styles.infoItem}>
            <View style={styles.eventIconContainer}>
              <Image source={require('../assets/calender.jpg')} style={styles.eventIcon} />
            </View>
          </View>
        </View>
        <Text style={styles.subtitle}>About Destination</Text>
        <Text style={styles.description}>{showFullDescription ? description : shortDescription}</Text>
        <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
          <Text style={styles.readMore}>{showFullDescription ? 'Read Less' : 'Read More'}</Text>
        </TouchableOpacity>
        <View style={styles.ratingRow}>
          <FontAwesomeIcon icon={faStar} style={styles.starIcon} />
          <Text style={styles.ratingText}>Rating</Text>
          <Text style={styles.ratingValue}>4.5 out of 5</Text>
        </View>
        
        <View style={styles.userRow}>
          <Image source={require('../assets/user.jpg')} style={styles.profileImage} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userHandle}>@johndoe</Text>
            <Text style={styles.comment}>Great place to visit! Highly recommend.</Text>
          </View>
          <FontAwesomeIcon icon={faTrash} style={styles.userIcon} />
          <FontAwesomeIcon icon={faEdit} style={styles.userIcon} />
        </View>
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noPostsText: {
    marginTop: 20,
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  iconsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
  },
  iconContainer: {
    marginLeft: 10,
  },
  icon: {
    color: '#333',
  },
  favoriteIconActive: {
    color: 'red', 
  },
  favoriteIconInactive: {
    color: '#333', 
  },
  traveledIconActive: {
    color: 'green', 
  },
  traveledIconInactive: {
    color: '#333', 
  },
  thumbnailContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  infoIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  weatherIcon: {
    color: '#FFA500',
    marginRight: 5,
  },
  eventIconContainer: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 20,
  },
  eventIcon: {
    width: 20,
    height: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  readMore: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  starIcon: {
    color: 'gold',
    marginRight: 5,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  ratingValue: {
    fontSize: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  userHandle: {
    color: '#666',
    marginBottom: 5,
  },
  comment: {
    marginBottom: 5,
  },
  userIcon: {
    marginLeft: 10,
    color: '#333',
  },
});

export default OnepostScreen;
