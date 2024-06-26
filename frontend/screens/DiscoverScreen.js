import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Rating from './Rating';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const DiscoverScreen = () => {
  const navigation = useNavigation();
  const [postRatings, setPostRatings] = useState({});
  const [categories, setCategories] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://192.168.1.19:3000/posts/allposts');
      const posts = await response.json();

      const categorizedPosts = categorizePosts(posts);

      setCategories(categorizedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const categorizePosts = (posts) => {
    const categories = {};

    posts.forEach((post) => {
      if (!categories[post.category]) {
        categories[post.category] = [];
      }
      categories[post.category].push({
        id: post.idposts,
        name: post.title,
        location: post.location,
        image: { uri: post.image1 },
        description: post.description,
        image2: post.image2 ? { uri: post.image2 } : null,
        image3: post.image3 ? { uri: post.image3 } : null,
        image4: post.image4 ? { uri: post.image4 } : null,
      });
    });

    return Object.keys(categories).map((key, index) => ({
      id: index + 1,
      name: key,
      posts: categories[key],
    }));
  };

  const handleRating = (postId, rating) => {
    setPostRatings((prevRatings) => ({
      ...prevRatings,
      [postId]: rating,
    }));
  };

  const navigateToPost = (postId, postDetails) => {
    console.log('Navigating to post ID:', postId);
    console.log('Post details:', postDetails);
    navigation.navigate('Onepost', { postId, postDetails });
  };

  const renderPostItem = ({ item }) => {
    const postId = item.id.toString();
    const selectedRating = postRatings[postId] || 0;

    return (
      <TouchableOpacity onPress={() => navigateToPost(postId, item)} style={styles.postContainer}>
        <Image source={item.image} style={styles.postImage} />
        <Text style={styles.postName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Image source={require('../assets/location.jpg')} style={styles.locationIcon} />
          <Text style={styles.postLocation}>{item.location}</Text>
        </View>
        <Rating postId={postId} selectedRating={selectedRating} onRate={(rating) => handleRating(postId, rating)} />
      </TouchableOpacity>
    );
  };

  const renderCategory = ({ item }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryName}>{item.name}</Text>
      <FlatList
        data={item.posts}
        renderItem={renderPostItem}
        keyExtractor={(post) => post.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/left-arrow.jpg')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Discover</Text>
        <TouchableOpacity onPress={() => {/* ps : i will add notification for later */ }}>
          <Image source={require('../assets/notification.jpg')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.subheaderText}>All Explored Places</Text>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(category) => category.id.toString()}
        contentContainerStyle={styles.categoriesContainer}
      />
    </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 50,
  },
  headerText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
  },
  subheaderText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 13,
    marginTop: 20,
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
    width: (width - 60) / 2, 
    marginRight: 40,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    marginLeft: -20,
  },
  postImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  postName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationIcon: {
    width: 12,
    height: 12,
    marginRight: 5,
  },
  postLocation: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  flatListContainer: {
    paddingLeft: 20,
  },
});

export default DiscoverScreen;
