import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';

const starGrey = require('../assets/star_grey.jpg');
const starGold = require('../assets/star_gold.jpg');

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
      const userRatingResponse = await fetch('http://192.168.100.4:3000/ratings/user-rating', {

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
      const averageRatingResponse = await fetch(`http://192.168.100.4:3000/ratings/average-rating/${postId}`);

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
      const response = await fetch('http://192.168.100.4:3000/ratings/rate', {

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
        <Image
          source={index < Math.round(rating) ? starGold : starGrey}
          style={styles.star}
        />
      </TouchableOpacity>
    ));
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
      <View style={{ flexDirection: 'row', marginRight: 10 }}>
        {stars}
      </View>
      <Text style={{ fontWeight: 'bold' }}>{selectedRating}</Text>
    </View>
  );
};

export default Rating;
