import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

const starGrey = require('../assets/star_grey.jpg');
const starGold = require('../assets/star_gold.jpg');

const Rating = ({ postId, onRate }) => {
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const { explorer, business } = useAuth();

  const userId = explorer.id || business.id;

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      // Fetch user's rating from local storage
      const storedRating = await AsyncStorage.getItem(`userRating_${userId}_${postId}`);
      if (storedRating) {
        setUserRating(parseFloat(storedRating));
      }

      // Fetch average rating from server
      const response = await fetch(`http://192.168.11.67:3000/posts/${postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post details');
      }
      const postData = await response.json();
      setAverageRating(postData.averageRating);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleRate = async (rating) => {
    try {
      const response = await fetch('http://192.168.11.67:3000/posts/ratepost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idposts: postId,
          userId: userId,
          rating: rating,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rate post');
      }

      const updatedPost = await response.json();
      setUserRating(rating);
      setAverageRating(updatedPost.averageRating);

      // Store user's rating locally
      await AsyncStorage.setItem(`userRating_${userId}_${postId}`, rating.toString());

      // Notify parent component
      onRate(rating);
    } catch (error) {
      console.error('Error rating post:', error);
    }
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((number, index) => (
      <TouchableOpacity
        key={index}
        activeOpacity={0.7}
        onPress={() => handleRate(number)}
      >
        <Image
          source={index < Math.round(rating) ? starGold : starGrey}
          style={styles.star}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {renderStars(userRating || averageRating || 0)}
      </View>
      <Text style={styles.ratingText}>
        {userRating ? userRating.toFixed(1) : averageRating ? averageRating.toFixed(1) : 'N/A'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 10,
  },
  star: {
    width: 20,
    height: 20,
    marginRight: 3,
  },
  ratingText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Rating;