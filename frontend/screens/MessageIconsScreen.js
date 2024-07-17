import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';

const MessengerIcon = ({ size = 24, color = '#0084FF' }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2C6.477 2 2 6.145 2 11.259C2 14.128 3.13 16.71 5 18.548V22.5L8.8 20.29C9.814 20.617 10.89 20.787 12 20.787C17.523 20.787 22 16.643 22 11.529C22 6.415 17.523 2 12 2ZM13.2 15L10.4 12L5 15L10.8 9L13.6 12L19 9L13.2 15Z"
          fill={color}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessengerIcon;