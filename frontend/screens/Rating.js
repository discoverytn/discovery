import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

const starGrey = require('../assets/star_grey.jpg');
const starGold = require('../assets/star_gold.jpg');

const Rating = ({ postId, selectedRating, onRate }) => {
  const stars = [1, 2, 3, 4, 5].map((_, index) => (
    <TouchableOpacity
      key={index}
      activeOpacity={0.7}
      onPress={() => onRate(index + 1)}
    >
      <Image
        source={index < selectedRating ? starGold : starGrey}
        style={{ width: 20, height: 20, marginRight: 3 }}
      />
    </TouchableOpacity>
  ));

  return (
    <View style={{ flexDirection: 'row', marginTop: 5 }}>
      {stars}
    </View>
  );
};

export default Rating;
