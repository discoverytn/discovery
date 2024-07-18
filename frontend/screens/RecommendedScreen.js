import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { DB_HOST, PORT } from "@env";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const RecommendedScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { explorer, business } = useAuth();

  useEffect(() => {
    if (explorer && explorer.idexplorer) {
      fetchRecommendedPosts();
    } else if (business && business.idbusiness) {
      fetchAllPosts();
    }
  }, [explorer, business]);

  const fetchRecommendedPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://${DB_HOST}:${PORT}/posts/recommended/${explorer.idexplorer}`);
      setPosts(response.data);
      checkFavouritePosts(response.data);
    } catch (error) {
      console.error('Error fetching recommended posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://${DB_HOST}:${PORT}/posts/allposts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching all posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFavouritePosts = async (fetchedPosts) => {
    if (!explorer || !explorer.idexplorer) return;

    try {
      const favouriteChecks = await Promise.all(
        fetchedPosts.map(post => 
          axios.get(`http://${DB_HOST}:${PORT}/explorer/${explorer.idexplorer}/favourites/${post.idposts}/check`)
        )
      );
      const newLikedPosts = {};
      favouriteChecks.forEach((response, index) => {
        newLikedPosts[fetchedPosts[index].idposts] = response.data.isFavourite;
      });
      setLikedPosts(newLikedPosts);
    } catch (error) {
      console.error('Error checking favourite posts:', error);
    }
  };

  const toggleLike = async (postId) => {
    if (!explorer || !explorer.idexplorer) return;

    try {
      await axios.post(`http://${DB_HOST}:${PORT}/explorer/${explorer.idexplorer}/favourites/${postId}/addOrRemove`);
      setLikedPosts(prev => {
        const newState = {...prev, [postId]: !prev[postId]};
        if (newState[postId]) {
          Alert.alert("Success", "Post added to favourites");
        } else {
          Alert.alert("Success", "Post removed from favourites");
        }
        return newState;
      });
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const renderPost = ({ item }) => {
    const isLiked = likedPosts[item.idposts];

    return (
      <View style={styles.postContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Onepost', { postId: item.idposts })}
        >
          <ImageBackground source={{ uri: item.image1 }} style={styles.postImage}>
            <View style={styles.overlay} />
            <View style={styles.textContainer}>
              <Text style={styles.postTitle}>{item.title}</Text>
              <Text style={styles.postLocation}>{item.location}</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        {explorer && explorer.idexplorer && (
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => toggleLike(item.idposts)}
          >
            <Icon 
              name={isLiked ? "heart" : "heart-o"} 
              size={24} 
              color={isLiked ? "red" : "white"} 
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (!explorer && !business) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please log in to see posts</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.title}>Loading posts...</Text>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No posts available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {explorer ? "Recommended Places" : "All Posts"}
      </Text>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.idposts.toString()}
        contentContainerStyle={styles.postsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  postsContainer: {
    paddingBottom: 16,
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
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  postLocation: {
    fontSize: 14,
    color: '#fff',
  },
  likeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
});

export default RecommendedScreen;