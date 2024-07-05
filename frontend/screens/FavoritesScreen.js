import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const FavoritesScreen = () => {
  const { explorer } = useAuth();
  const [explorerId, setExplorerId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  React.useEffect(() => {
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

  const fetchFavorites = async (explorerId) => {
    setLoading(true);
    try {
      const url = `http://192.168.1.19:3000/explorer/${explorerId}/favourites`;
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
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Discover')}>
          <View style={styles.backArrowContainer}>
            <ImageBackground
              source={require('../assets/left-arrow.jpg')}
              style={styles.backArrow}
              imageStyle={{ borderRadius: 15 }}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>Favorite Places</Text>
          <Image source={require('../assets/favoritesicon.gif')} style={styles.logo} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  backArrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
  backArrow: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#20281d',
    marginRight: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  logo: {
    width: 30,
    height: 30,
  },
  noFavoritesText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  postsContainer: {
    paddingHorizontal: 10,
  },
  post: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
    color: 'grey',
    fontSize: 12,
  },
});

export default FavoritesScreen;