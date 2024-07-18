import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { DB_HOST, PORT } from "@env";
import Icon from 'react-native-vector-icons/FontAwesome';

const Rating = ({ postId, onRate }) => {
  const [userRating, setUserRating] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const { explorer } = useAuth();

  useEffect(() => {
    fetchRatings();
  }, [postId, explorer.idexplorer]);

  const fetchRatings = async () => {
    try {
      // fetch user's rating from server
      const userRatingResponse = await fetch(`http://${DB_HOST}:${PORT}/ratings/user-rating`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idposts: postId,
          explorer_idexplorer: explorer.idexplorer,
        }),
      });
      
      console.log('User rating response:', userRatingResponse);
      
      if (userRatingResponse.ok) {
        const userData = await userRatingResponse.json();
        console.log('User rating data:', userData);
        if (userData.rating) {
          setUserRating(userData.rating);
        }
      }
  
      // fetch average rating for the post
      const averageRatingResponse = await fetch(`http://${DB_HOST}:${PORT}/ratings/average-rating/${postId}`);

      if (averageRatingResponse.ok) {
        const averageData = await averageRatingResponse.json();
        setAverageRating(parseFloat(averageData.averageRating));
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleRate = async (rating) => {
    try {
      const response = await fetch(`http://${DB_HOST}:${PORT}/ratings/rate`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idposts: postId,
          explorer_idexplorer: explorer.idexplorer,
          rating: rating,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to rate post');
      }
  
      const updatedRating = await response.json();
      setUserRating(rating);
      setAverageRating(parseFloat(updatedRating.averageRating));
  
      
      onRate(rating);
  
    } catch (error) {
      console.error('Error rating post:', error);
      Alert.alert('Error', error.message || 'Failed to rate post');
    }
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((number, index) => (
      <TouchableOpacity
        key={index}
        activeOpacity={0.7}
        onPress={() => handleRate(number)}
      >
        <Icon
          name={index < Math.round(rating) ? 'star' : 'star-o'}
          size={15}
          color="#FFD700"
          style={styles.star}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {renderStars(userRating || 0)}
      </View>
      <Text style={styles.ratingText}>
        {userRating ? userRating.toFixed(1) : 'Rate'}
      </Text>
      {averageRating && (
        <Text style={styles.averageRatingText}>
          Avg: {averageRating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  averageRatingText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default Rating;