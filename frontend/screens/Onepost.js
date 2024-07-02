import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faPaperPlane, faCloudSunRain, faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; 
import { useAuth } from '../context/AuthContext';

const OnepostScreen = ({ route }) => {
  const [postData, setPostData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false); 
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
      const response = await axios.get(`http://192.168.100.3:3000/explorer/${idexplorer}/favourites/${postId}/check`);

      setIsFavorited(response.data.favorited); 
    } catch (error) {
      console.error('Error checking if post is favorited:', error);
    }
  };

  if (!postData) {
    return <Text>Loading...</Text>;
  }

  const { postId, postDetails } = postData;
  const {
    name,
    location,
    image,
    image2,
    image3,
    image4,
    description,
  } = postDetails;

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
      <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
      <ScrollView horizontal style={styles.imageCarousel}>
        <TouchableOpacity onPress={() => handleImagePress(image.uri)}>
          <Image source={{ uri: image.uri }} style={styles.carouselImage} />
        </TouchableOpacity>
        {image2 && (
          <TouchableOpacity onPress={() => handleImagePress(image2.uri)}>
            <Image source={{ uri: image2.uri }} style={styles.carouselImage} />
          </TouchableOpacity>
        )}
        {image3 && (
          <TouchableOpacity onPress={() => handleImagePress(image3.uri)}>
            <Image source={{ uri: image3.uri }} style={styles.carouselImage} />
          </TouchableOpacity>
        )}
        {image4 && (
          <TouchableOpacity onPress={() => handleImagePress(image4.uri)}>
            <Image source={{ uri: image4.uri }} style={styles.carouselImage} />
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={styles.contentContainer}>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={addToFavorites}>
            <FontAwesomeIcon
              icon={faHeart}
              size={25}
              color={isFavorited ? 'red' : 'black'} 
              style={styles.icon}
            />
          </TouchableOpacity>
          <FontAwesomeIcon
            icon={faPaperPlane}
            size={25}
            style={styles.icon}
            onPress={handleSendPost}
          />
          <FontAwesomeIcon
            icon={faCloudSunRain}
            size={25}
            style={styles.icon}
          />
          <FontAwesomeIcon
            icon={faStar}
            size={25}
            style={styles.icon}
          />
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.location}>{location}</Text>
        <Text style={styles.description}>
          {showFullDescription ? description : shortDescription}
          {description.length > 100 && (
            <Text
              style={styles.readMore}
              onPress={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? ' Show less' : ' Read more'}
            </Text>
          )}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  selectedImage: {
    width: '100%',
    height: 400,
    marginBottom: 10,
  },
  imageCarousel: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  carouselImage: {
    width: 100,
    height: 100,
    marginRight: 5,
  },
  contentContainer: {
    padding: 20,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    fontSize: 18,
    color: '#888',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  readMore: {
    color: '#888',
  },
});

export default OnepostScreen;
