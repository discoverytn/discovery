import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faPaperPlane, faCloudSunRain, faStar, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const OnepostScreen = ({ route }) => {
  const { postId } = route.params;
  const [postDetails, setPostDetails] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showMoreReviews, setShowMoreReviews] = useState(false);

  useEffect(() => {
    fetchPostDetails();
  }, []);

  const fetchPostDetails = async () => {
    try {
      const response = await fetch(`http://192.168.1.19:3000/posts/onepost/${postId}`);
      const postData = await response.json();
      setPostDetails(postData);
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  const handleSeeMorePress = () => {
    setShowFullDescription(!showFullDescription);
  };

  if (!postDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const { title, description, location, image1, image2, image3, image4 } = postDetails;

  const mainImage = { uri: image1 };
  const images = [
    
    { source: { uri: image2 } },
    { source: { uri: image3 } },
    { source: { uri: image4 } },
  ];

  const shortDescription = description.slice(0, 100) + '...';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={mainImage} style={styles.mainImage} />
        <View style={styles.iconsContainer}>
          <FontAwesomeIcon icon={faHeart} style={styles.icon} size={26} />
          <FontAwesomeIcon icon={faPaperPlane} style={styles.icon} size={26} />
        </View>
        <View style={styles.thumbnailContainer}>
          {images.map((img, index) => (
            <TouchableOpacity key={index} onPress={() => setSelectedImage(img.source)}>
              <Image source={img.source} style={styles.thumbnail} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Image source={require('../assets/location.jpg')} style={styles.infoIcon} />
            <Text style={styles.infoText}>{location}</Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesomeIcon icon={faCloudSunRain} style={styles.weatherIcon} size={32} />
            <Text style={styles.infoText}>25°C</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>About Destination</Text>
        <Text style={styles.description}>{showFullDescription ? description : shortDescription}</Text>
        <TouchableOpacity onPress={handleSeeMorePress}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  weatherIcon: {
    color: 'blue',
    marginRight: 8,
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
