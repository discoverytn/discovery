import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { DB_HOST, PORT } from "@env";
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import LottieView from 'lottie-react-native';

const FavoritesScreen = () => {
  const { explorer } = useAuth();
  const [explorerId, setExplorerId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const lottieRef = useRef(null);

  useEffect(() => {
    if (explorer && explorer.idexplorer) {
      setExplorerId(explorer.idexplorer);
    }
  }, [explorer]);

  useFocusEffect(
    useCallback(() => {
      if (explorerId) {
        fetchFavorites(explorerId);
      }
    }, [explorerId])
  );

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
      
      // Set up a loop to play the animation twice
      let playCount = 0;
      const loopAnimation = () => {
        playCount++;
        if (playCount < 2) {
          lottieRef.current.play();
        }
      };

      lottieRef.current.onAnimationFinish = loopAnimation;
    }

    return () => {
      if (lottieRef.current) {
        lottieRef.current.onAnimationFinish = null;
      }
    };
  }, []);

  const fetchFavorites = async (explorerId) => {
    setLoading(true);
    try {
      const url = `http://${DB_HOST}:${PORT}/explorer/${explorerId}/favourites`;

      const response = await axios.get(url);
      console.log('Favorites fetched:', response.data);
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      <TouchableOpacity activeOpacity={0.7}>
        <Image source={{ uri: item.post_image1 }} style={styles.postImage} />
        <View style={styles.heartIcon}>
          <ImageBackground
            source={require('../assets/hearted.jpg')}
            style={styles.heartImage}
            imageStyle={{ borderRadius: 15 }}
          />
        </View>
      </TouchableOpacity>
      <Text style={styles.postName}>{item.post_title}</Text>
      <View style={styles.locationContainer}>
        <View style={styles.locationIconContainer}>
          <ImageBackground
            source={require('../assets/location.jpg')}
            style={styles.locationIcon}
            imageStyle={{ borderRadius: 7.5 }}
          />
        </View>
        <Text style={styles.postLocation}>{item.post_location}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#8e9eef" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Discover')} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>Favorite Places</Text>
          <LottieView
            ref={lottieRef}
            source={require('../assets/favoriteslogo.json')}
            style={styles.logo}
            loop={false}
            autoPlay={true}
          />
        </View>
      </View>
      {favorites.length === 0 ? (
        <Text style={styles.noFavoritesText}>No favorites found.</Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.idfavorites.toString()}
          numColumns={2}
          contentContainerStyle={styles.postsContainer}
        />
      )}
      <Navbar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#8e9eef',
  },
  backButton: {
    padding: 5,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  logo: {
    width: 40,
    height: 40,
  },
  noFavoritesText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
  },
  postsContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  post: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    padding: 5,
    width: 30,
    height: 30,
  },
  heartImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  postName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationIconContainer: {
    width: 20,
    height: 20,
    marginRight: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  locationIcon: {
    width: '100%',
    height: '100%',
  },
  postLocation: {
    color: '#666',
    fontSize: 12,
  },
});

export default FavoritesScreen;