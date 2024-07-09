import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faPaperPlane, faCloudSunRain, faStar, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const OnepostScreen = () => {
  const mainImage = require('../assets/onep.jpg');
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const scrollViewRef = useRef(null);
  const { explorer, business } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (route.params) {
      const { postId, postDetails } = route.params;
      setPostData({ postId, postDetails });
      setSelectedImage(postDetails.image.uri);
      checkIfPostFavorited(postId);
      checkIfPostTraveled(postId);
      fetchPostDetails(postId);
      fetchWeatherData(postDetails.location);
      fetchComments(postId);
    }
  }, [route.params]);

  const fetchPostDetails = async (postId) => {
    try {
      const response = await axios.get(`http://192.168.100.4:3000/posts/onepost/${postId}`);

      setAverageRating(parseFloat(response.data.averageRating));
      setPostData(prevData => ({
        ...prevData,
        postDetails: {
          ...prevData.postDetails,
          averageRating: parseFloat(response.data.averageRating),
        },
      }));
    } catch (error) {
      console.error('Error fetching post details:', error);
      Alert.alert('Error', 'Failed to fetch post details');
    }
  };

  const fetchWeatherData = async (location) => {
    const options = {
      method: 'GET',
      url: 'https://api.tomorrow.io/v4/weather/realtime',
      params: {
        location: location,
        units: 'metric',
        apikey: '7FU1FI9CTOulnIYgaTTCHHOIXyfS4WlF'
      },
      headers: {accept: 'application/json'}
    };

    try {
      const response = await axios.request(options);
      setWeatherData(response.data.data.values);
      setCoordinates({
        latitude: response.data.location.lat,
        longitude: response.data.location.lon
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const openMap = () => {
    if (coordinates) {
      const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
      const latLng = `${coordinates.latitude},${coordinates.longitude}`;
      const label = postData.postDetails.location;
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
      });

      Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Location coordinates are not available');
    }
  };

  const checkIfPostFavorited = async (postId) => {
    try {
      const idexplorer = explorer.idexplorer;
      const response = await axios.get(`http://192.168.100.4:3000/explorer/${idexplorer}/favourites/${postId}/check`);

      setIsFavorited(response.data.favorited);
    } catch (error) {
      console.error('Error checking if post is favorited:', error);
    }
  };

  const checkIfPostTraveled = async (postId) => {
    try {
      const idexplorer = explorer.idexplorer;
      const response = await axios.get(`http://192.168.100.4:3000/explorer/${idexplorer}/traveled/${postId}/check`);

      setIsTraveled(response.data.traveled);
    } catch (error) {
      console.error('Error checking if post is traveled:', error);
    }
  };


const addToFavorites = async () => {
  try {
    const idexplorer = explorer.idexplorer;
    const response = await axios.post(`http://192.168.100.4:3000/explorer/${idexplorer}/favourites/${postId}/addOrRemove`, {

      idposts: postId,
    });

    if (response.data.message === "Post added to favorites") {
      setIsFavorited(true);
      Alert.alert('Success', 'Post added to favorites');
      
      // Create a notification for the post owner
      await axios.post('http://192.168.100.4:3000/notifications/create', {

        type: 'favorite',
        message: `${explorer.firstname} ${explorer.lastname} added your post to favorites`,
        explorer_idexplorer: postDetails.explorer_idexplorer, // Assuming this is the post owner's ID
        business_idbusiness: null,
        senderImage: explorer.image
      });
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
    const response = await axios.post(`http://192.168.100.4:3000/explorer/${idexplorer}/traveled/${postId}/addOrRemove`, {

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

const handleSeeMorePress = () => {
  setShowMoreReviews(!showMoreReviews);

  if (!showMoreReviews && scrollViewRef.current) {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }
};

const fetchComments = async (postId) => {
  try {
    const response = await axios.get(`http://192.168.100.4:3000/comments/post/${postId}`);

    setComments(response.data);
  } catch (error) {
    console.error('Error fetching comments:', error);
    Alert.alert('Error', 'Failed to fetch comments');
  }
};

const handleAddComment = async () => {
  if (!newComment.trim()) return;

  try {
    const commentData = {
      idposts: postData.postId,
      content: newComment,
      explorer_idexplorer: explorer.idexplorer,
      business_idbusiness: business.idbusiness
    };

    const response = await axios.post('http://192.168.100.4:3000/comments/create', commentData);

    
   
    const newCommentWithUser = {
      ...response.data.comment,
      Explorer: explorer.idexplorer ? {
        idexplorer: explorer.idexplorer,
        firstname: explorer.firstname,
        lastname: explorer.lastname,
        username: explorer.username,
        image: explorer.image
      } : null,
      Business: business.idbusiness ? {
        idbusiness: business.idbusiness,
        businessname: business.businessname,
        firstname: business.firstname,
        lastname: business.lastname,
        username: business.username,
        image: business.image
      } : null
    };

    setComments([newCommentWithUser, ...comments]);
    setNewComment('');
  } catch (error) {
    console.error('Error adding comment:', error);
    Alert.alert('Error', 'Failed to add comment');
  }
};

const handleEditComment = async (commentId, newContent) => {
  try {
    await axios.put(`http://192.168.100.4:3000/comments/${commentId}`, { content: newContent });

    setComments(comments.map(comment => 
      comment.idcomments === commentId ? { ...comment, content: newContent } : comment
    ));
    setEditingCommentId(null);
  } catch (error) {
    console.error('Error editing comment:', error);
    Alert.alert('Error', 'Failed to edit comment');
  }
};

const handleDeleteComment = async (commentId) => {
  try {
    await axios.delete(`http://192.168.100.4:3000/comments/${commentId}`);

    setComments(comments.filter(comment => comment.idcomments !== commentId));
  } catch (error) {
    console.error('Error deleting comment:', error);
    Alert.alert('Error', 'Failed to delete comment');
  }
};

const getUserImage = (user) => {
  if (!user) return require('../assets/user.jpg');
  return user.image && user.image.startsWith('http') 
    ? { uri: user.image } 
    : require('../assets/user.jpg');
};

const getUserDisplayName = (user) => {
  if (!user) return 'Unknown User';
  if (user.firstname && user.lastname) return `${user.firstname} ${user.lastname}`;
  return user.username || user.businessname || 'Unknown User';
};

if (!postData) {
  return (
    <ScrollView style={styles.container} ref={scrollViewRef}>
      <View style={styles.imageContainer}>
        <Image source={selectedImage} style={styles.mainImage} />
        <View style={styles.iconsContainer}>
          <FontAwesomeIcon icon={faHeart} style={styles.icon} size={26} />
          <FontAwesomeIcon icon={faPaperPlane} style={styles.icon1} size={26} />
        </View>
        <View style={styles.thumbnailContainer}>
          <TouchableOpacity onPress={() => setSelectedImage(require('../assets/cycling.jpg'))}>
            <Image source={require('../assets/cycling.jpg')} style={styles.thumbnail} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedImage(require('../assets/eljem.jpg'))}>
            <Image source={require('../assets/eljem.jpg')} style={styles.thumbnail} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedImage(require('../assets/kairouen1.jpg'))}>
            <Image source={require('../assets/kairouen1.jpg')} style={styles.thumbnail} />
          </TouchableOpacity>
          {selectedImage !== mainImage && (
            <TouchableOpacity onPress={() => setSelectedImage(mainImage)}>
              <Image source={mainImage} style={styles.thumbnail} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>Nefza</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Image source={require('../assets/location.jpg')} style={styles.infoIcon} />
            <Text style={styles.infoText}>Location</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesomeIcon icon={faCloudSunRain} style={styles.weatherIcon} size={32}/>
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
        <TouchableOpacity style={styles.seeMoreButton} onPress={handleSeeMorePress}>
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
    marginTop:11
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
    marginRight:5,
    fontStyle:'italic'
  },
  weatherIcon: {
   
    color: 'blue',
    marginRight: 8,
    marginLeft:-22
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
    marginTop: 20,
  },
  starIcon: {
    color: 'gold',
    marginRight: 10,
  },
  ratingText: {
    color: 'grey',
    marginRight: 10,
  },
  ratingValue: {
    color: 'grey',
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
});

export default OnepostScreen;
