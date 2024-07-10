import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DB_HOST, PORT } from "@env";

const Intro1 = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/eljem.jpg")} 
        style={styles.image}
      />
      <Image
        source={require("../assets/into1title.jpg")}
        style={styles.headlineImage}
      />
      <Text style={styles.subheading}>
      Uncover extraordinary destinations and plan your next adventure effortlessly.{'\n'} {'\n'}
      Explore Tunisia's hidden gems with our app showcasing unique places around the country!
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Intro2')} >
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
    backgroundColor: '#00aacc',
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

export default Intro1;