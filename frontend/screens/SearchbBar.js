
import React from 'react';
import { View, StyleSheet, Image, TextInput } from 'react-native';

const SearchBar = () => {
  return (
    <View style={styles.searchContainer}>
      <Image
        resizeMode="auto"
        source={{ uri: "" }}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Search for chats & messages"
        placeholderTextColor="#7D848D"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    borderRadius: 16,
    backgroundColor: "#F7F7F9",
    display: "flex",
    marginTop: 26,
    width: "100%",
    maxWidth: 335,
    alignItems: "stretch",
    gap: 12,
    fontSize: 16,
    color: "#7D848D",
    fontWeight: "400",
    letterSpacing: 0.3,
    padding: "12px 16px",
  },
  searchIcon: {
    position: "relative",
    width: 24,
    flexShrink: 0,
    aspectRatio: 1,
  },
  searchInput: {
    fontFamily: "SF UI Display, sans-serif",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
    margin: "auto 0",
  },
});

export default SearchBar;