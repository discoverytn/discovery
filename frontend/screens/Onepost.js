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
    }
  }, [route.params]);

  const checkIfPostFavorited = async (postId) => {
    try {
      const idexplorer = explorer.idexplorer; 
      const response = await axios.get(`http://192.168.1.19:3000/explorer/${idexplorer}/favourites/${postId}/check`);
      setIsFavorited(response.data.favorited); 
    } catch (error) {
      console.error('Error checking if post is favorited:', error);
    }
  };

  if (!postData) {
    return  <View style={styles.loadingContainer}>
    <Text style={styles.loadingText}>Onepost</Text>
    <Text style={styles.noPostsText}>No post selected yet !</Text>
  </View>
  }

  const { postId, postDetails } = postData;
  const { name, location, image, image2, image3, image4, description } = postDetails;

  const shortDescription = description.slice(0, 100) + '...';

  const addToFavorites = async () => {
    try {
      const idexplorer = explorer.idexplorer; 
      const response = await axios.post(`http://192.168.1.19:3000/explorer/${idexplorer}/favourites/${postId}/addOrRemove`, {
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
  
  const handleScrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const handleSendPost = () => {
    Alert.alert('Post sent', 'Your post has been sent successfully!');
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
          <FontAwesomeIcon icon={faPaperPlane} style={styles.icon1} size={26} onPress={handleSendPost} />
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
        <TouchableOpacity style={styles.seeMoreButton} onPress={() => setShowMoreReviews(!showMoreReviews)}>
          <Text style={styles.seeMoreText}>{showMoreReviews ? 'Hide reviews' : 'See more reviews'}</Text>
        </TouchableOpacity>
        {showMoreReviews && (
          <View style={styles.reviewsContainer}>
            <View style={styles.userRow}>
              <Image source={require('../assets/user.jpg')} style={styles.profileImage} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Jane Smith</Text>
                <Text style={styles.userHandle}>@janesmith</Text>
                <Text style={styles.comment}>Amazing experience, will come back!</Text>
              </View>
            </View>
            <View style={styles.userRow}>
              <Image source={require('../assets/user.jpg')} style={styles.profileImage} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Alex Johnson</Text>
                <Text style={styles.userHandle}>@alexjohnson</Text>
                <Text style={styles.comment}>Beautiful scenery and great weather.</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 350,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 7,
  },
  iconsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'column',
  },
  icon: {
    color: '#DB81B6',
    marginBottom: 12,
    marginTop: 11,
  },
  icon1: {
    color: '#2ac00a',
    marginBottom: 12,
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 5,
    borderRadius: 20,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 5,
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
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  infoText: {
    fontSize: 16,
    color: 'grey',
    marginRight: 5,
    fontStyle: 'italic',
  },
  weatherIcon: {
    color: 'blue',
    marginRight: 8,
  },
  eventIconContainer: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
  },
  eventIcon: {
    width: 35,
    height: 35,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: 'grey',
  },
  readMore: {
    color: 'orange',
    marginTop: 5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  starIcon: {
    color: 'yellow',
    marginRight: 5,
  },
  ratingText: {
    fontSize: 16,
    marginRight: 5,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteIconInactive: {
    color: '#DB81B6',
  },
  favoriteIconActive: {
    color: '#f00',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
  },
  userHandle: {
    color: 'violet',
  },
  comment: {
    color: 'grey',
  },
  userIcon: {
    color: 'grey',
    marginLeft: 10,
  },
  seeMoreButton: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  seeMoreText: {
    color: 'grey',
  },
  reviewsContainer: {
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  noPostsText: {
    fontSize: 18,
    color: 'grey',
  }
});

export default OnepostScreen;