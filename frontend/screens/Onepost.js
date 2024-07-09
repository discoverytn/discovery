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

  const description = "this place was recommended to me by one of my friends, after i you get there the locals will help guide you , it's one of the best natural places i got to visit and had a blast on my time there";
  const shortDescription = description.slice(0, 100) + '...';

  const handleSeeMorePress = () => {
    setShowMoreReviews(!showMoreReviews);
  
    if (!showMoreReviews && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

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
