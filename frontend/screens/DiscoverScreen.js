
import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import Rating from './Rating';

const categories = [
  {
    id: 1,
    name: 'Nature',
    posts: [
      { id: '1', name: 'Niladri Reservoir', location: 'Tekergat, Sunamgnj', image: require('../assets/nature.jpg') },
      { id: '2', name: 'Casa Las Tortugas', location: 'Av Damero, Mexico', image: require('../assets/nature.jpg') }
    ]
  },
  {
    id: 2,
    name: 'Sites',
    posts: [
      { id: '3', name: 'Aonang Villa Resort', location: 'Bastola, Islampur', image: require('../assets/kairouen1.jpg') },
      { id: '4', name: 'Rangauti Resort', location: 'Sylhet, Airport Road', image: require('../assets/djeem.jpg') }
    ]
  },
  {
    id: 3,
    name: 'Coffe shops',
    posts: [
      { id: '5', name: 'Aonang Villa Resort', location: 'Bastola, Islampur', image: require('../assets/kairouen1.jpg') },
      { id: '6', name: 'Rangauti Resort', location: 'Sylhet, Airport Road', image: require('../assets/djeem.jpg') }
    ]
  },
];

const DiscoverScreen = () => {
  const [postRatings, setPostRatings] = useState({});

  const handleRating = (postId, rating) => {
    setPostRatings(prevRatings => ({
      ...prevRatings,
      [postId]: rating
    }));
  };

  const renderPostItem = ({ item }) => {
    const postId = item.id.toString();
    const selectedRating = postRatings[postId] || 0;

    return (
      <View style={styles.postContainer}>
        <Image source={item.image} style={styles.postImage} />
        <Text style={styles.postName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Image source={require('../assets/location.jpg')} style={styles.locationIcon} />
          <Text style={styles.postLocation}>{item.location}</Text>
        </View>
        <Rating
          postId={postId}
          selectedRating={selectedRating}
          onRate={(rating) => handleRating(postId, rating)}
        />
      </View>
    );
  };

  const renderCategory = ({ item }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryName}>{item.name}</Text>
      <FlatList
        data={item.posts}
        renderItem={renderPostItem}
        keyExtractor={(post) => post.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Discover</Text>
      </View>
      <Text style={styles.subheaderText}>All Explored Places</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(category) => category.id.toString()}
        contentContainerStyle={styles.categoriesContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subheaderText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  categoriesContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postContainer: {
    width: 250,
    marginRight: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  postName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationIcon: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
  postLocation: {
    fontSize: 14,
    color: '#666',
  },
  flatListContainer: {
    paddingLeft: 20,
  },
});

export default DiscoverScreen;
