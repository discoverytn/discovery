import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const posts = [
  { id: 1, name: 'Djem', location: 'Route Mahdia', image: require('../assets/djeem.jpg') },
  { id: 2, name: 'Kairo mosque', location: 'Kairouen', image: require('../assets/kairouen1.jpg') },
  { id: 3, name: 'souq tunis', location: 'Tunis ville', image: require('../assets/souq.jpg') },
  { id: 4, name: 'Graffiti', location: 'jbel jloud', image: require('../assets/art.jpg') },
  { id: 5, name: 'camping', location: 'ariana', image: require('../assets/camping.jpg') },
  { id: 6, name: 'eljem', location: 'Mahdia', image: require('../assets/eljem.jpg') },
];

const FavoritesScreen = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const navigation = useNavigation();

  const toggleLike = (id) => {
    setLikedPosts((prevLiked) =>
      prevLiked.includes(id) ? prevLiked.filter((postId) => postId !== id) : [...prevLiked, id]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => toggleLike(item.id)}
        onLongPress={() => toggleLike(item.id)}
      >
        <Image source={item.image} style={styles.postImage} />
        {likedPosts.includes(item.id) && (
          <View style={styles.heartIcon}>
            <ImageBackground
              source={require('../assets/hearted.jpg')}
              style={styles.heartImage}
              imageStyle={{ borderRadius: 15 }} 
            />
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.postName}>{item.name}</Text>
      <View style={styles.locationContainer}>
        <View style={styles.locationIconContainer}>
          <ImageBackground
            source={require('../assets/location.jpg')}
            style={styles.locationIcon}
            imageStyle={{ borderRadius: 7.5 }} 
          />
        </View>
        <Text style={styles.postLocation}>{item.location}</Text>
      </View>
    </View>
  );

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
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.postsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
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
