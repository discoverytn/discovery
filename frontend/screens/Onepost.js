import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faGlobe } from '@fortawesome/free-solid-svg-icons';

const OnepostScreen = () => {
  const mainImage = require('../assets/onep.jpg');
  const [selectedImage, setSelectedImage] = useState(mainImage);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={selectedImage} style={styles.mainImage} />
        <View style={styles.iconsContainer}>
          <FontAwesomeIcon icon={faHeart} style={styles.icon} size={30} />
          <FontAwesomeIcon icon={faGlobe} style={styles.icon1} size={30} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    // marginTop: 30,
  },
  mainImage: {
    width: '100%',
    height: 350,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  iconsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'column',
  },
  icon: {
    color: '#DB81B6',
    marginTop:10,
    marginBottom: 10,
  },
  icon1: {
    color: '#00ffff',
    marginBottom: 10,
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
  moreThumbnailContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  moreThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
  },
  moreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OnepostScreen;
