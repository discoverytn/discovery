import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';

const starGrey = require('../assets/star_grey.jpg');
const starGold = require('../assets/star_gold.jpg');

const Rating = ({ postId, selectedRating, onRate }) => {
  const stars = [1, 2, 3, 4, 5].map((number, index) => (
    <TouchableOpacity
      key={index}
      activeOpacity={0.7}
      onPress={() => onRate(number)}
    >
      <Image
        source={index < selectedRating ? starGold : starGrey}
        style={{ width: 20, height: 20, marginRight: 3 }}
      />
    </TouchableOpacity>
  ));

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
