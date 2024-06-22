import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const Intro2 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/kairouen.jpg")} 
        style={styles.image}
      />
      <Image
        source={require("../assets/intro2title.png")}
        style={styles.headlineImage}
      />
      <Text style={styles.subheading}>
        At Friends tours and travel, we customize reliable and trustworthy educational tours to destinations all over the world.
      </Text>
      <TouchableOpacity style={styles.button} >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    
  },
  image: {
    width: 391,
    height: 350,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  
  },
  headlineImage: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,

  },
  subheading: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Intro2;