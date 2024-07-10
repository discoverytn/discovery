import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ImageBackground } from 'react-native';
import { DB_HOST, PORT } from "@env";

const posts = [
  { id: 1, name: 'Djem', location: 'Route Mahdia', image: require('../assets/djeem.jpg') },
  { id: 2, name: 'Kairo mosque', location: 'Kairouen', image: require('../assets/kairouen1.jpg') },
  { id: 3, name: 'souq tunis', location: 'Tunis ville', image: require('../assets/souq.jpg') },
  { id: 4, name: 'Kartaj', location: 'Carthage', image: require('../assets/sidibousaid.jpg') },
  { id: 5, name: 'djerba', location: 'Djerba', image: require('../assets/djeem.jpg') },
];

const RecommendedScreen = ({ navigation }) => {
  const [likedPosts, setLikedPosts] = useState([]);

  const toggleLike = (postId) => {
    setLikedPosts((prevLikedPosts) =>
      prevLikedPosts.includes(postId)
        ? prevLikedPosts.filter((id) => id !== postId)
        : [...prevLikedPosts, postId]
    );
  };

  const renderPost = ({ item }) => {
    const isLiked = likedPosts.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.postContainer}
        onPress={() => navigation.navigate('OnePost', { postId: item.id })}
      >
        <ImageBackground source={item.image} style={styles.postImage}>
          <TouchableOpacity
            style={styles.likeButton}
            onPress={() => toggleLike(item.id)}
          >
            <Text style={[styles.likeButtonText, isLiked && styles.liked]}>
              {isLiked ? '❤️' : '💟'}
            </Text>
          </TouchableOpacity>
          <View style={styles.overlay} />
          <View style={styles.textContainer}>
            <Text style={styles.postTitle}>{item.name}</Text>
            <Text style={styles.postLocation}>{item.location}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Places</Text>
      <FlatList
        scrollEnabled={false}
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
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
  likeButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  liked: {
    color: 'red',
  },
});

export default RecommendedScreen;