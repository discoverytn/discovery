import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Alert, ImageBackground } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Rating from './Rating';
import { useAuth } from '../context/AuthContext';
import { DB_HOST, PORT } from "@env";
import Navbar from './Navbar'; 
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const DiscoverScreen = () => {
  const { explorer, business } = useAuth();
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://${DB_HOST}:${PORT}/posts/allposts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const posts = await response.json();
      const categorizedPosts = categorizePosts(posts);
      setCategories(categorizedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts().then(() => setRefreshing(false));
  }, [fetchPosts]);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [fetchPosts])
  );

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
        averageRating: post.averageRating,
      });
    });

    return Object.keys(categories).map((key, index) => ({
      id: index + 1,
      name: key,
      posts: categories[key],
    }));
  };

  const handleRating = useCallback(async (postId, rating) => {
    try {
      const response = await fetch(`http://${DB_HOST}:${PORT}/ratings/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idposts: postId, 
          explorer_idexplorer: explorer.idexplorer, 
          rating 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit rating');
      }
      
      const data = await response.json();
      
      setCategories(prevCategories => 
        prevCategories.map(category => ({
          ...category,
          posts: category.posts.map(post => 
            post.id === postId ? { ...post, averageRating: parseFloat(data.averageRating) } : post
          )
        }))
      );
  
      Alert.alert('Success', 'Rating submitted successfully');
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', error.message || 'Failed to submit rating');
    }
  }, [explorer.idexplorer]);

  const navigateToPost = useCallback((postId, postDetails) => {
    navigation.navigate('Onepost', { postId, postDetails });
  }, [navigation]);

  const renderPostItem = useMemo(() => ({ item }) => {
    const postId = item.id.toString();
  
    return (
      <TouchableOpacity onPress={() => navigateToPost(postId, item)} style={styles.postContainer}>
        <ImageBackground source={item.image} style={styles.postImage}>
          <View style={styles.overlay} />
          <View style={styles.textContainer}>
            <View>
              <Text style={styles.postName}>{item.name}</Text>
              <Text style={styles.postLocation}>{item.location}</Text>
            </View>
            {business && Object.keys(business).length > 0 ? (
              <Text style={styles.businessText}>Business view, no ratings</Text>
            ) : explorer && Object.keys(explorer).length > 0 ? (
              <Rating 
                postId={postId} 
                onRate={(rating) => handleRating(postId, rating)}
              />
            ) : (
              <Text style={styles.signupText}>Sign up to rate this!</Text>
            )}
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }, [navigateToPost, handleRating, business, explorer]);

  const renderCategory = useCallback(({ item }) => (
    <TouchableOpacity 
      style={[styles.categoryContainer, selectedCategory === item.name && styles.selectedCategory]}
      onPress={() => setSelectedCategory(item.name === selectedCategory ? null : item.name)}
    >
      <Image source={{ uri: item.posts[0].image.uri }} style={styles.categoryImage} />
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>{item.posts.length} post{item.posts.length !== 1 ? 's' : ''}</Text>
    </TouchableOpacity>
  ), [selectedCategory]);

  const filteredPosts = useMemo(() => {
    if (!selectedCategory) {
      return categories.flatMap(category => category.posts);
    }
    return categories.find(category => category.name === selectedCategory)?.posts || [];
  }, [categories, selectedCategory]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../assets/left-arrow.jpg')} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Discover</Text>
          <TouchableOpacity onPress={() => {/* Add notification functionality later */}}>
            <Image source={require('../assets/notification.jpg')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subheaderText}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(category) => category.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
        <Text style={styles.subheaderText}>
          {selectedCategory ? `${selectedCategory} Places` : 'All Explored Places'}
        </Text>
        <FlatList
          data={filteredPosts}
          renderItem={renderPostItem}
          keyExtractor={(post) => post.id.toString()}
          contentContainerStyle={styles.postsContainer}
        />
      </ScrollView>
      <View style={styles.navbarContainer}>
        <Navbar navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 80,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 13,
    marginTop: 20,
  },
  categoriesContainer: {
    paddingBottom: 20,
  },
  categoryContainer: {
    marginRight: 15,
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 5,
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
  },
  postsContainer: {
    flexGrow: 1,
  },
  postContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  textContainer: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  postName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  postLocation: {
    fontSize: 14,
    color: '#fff',
  },
  businessText: {
    fontSize: 14,
    color: '#fff',
  },
  signupText: {
    fontSize: 14,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default React.memo(DiscoverScreen);