import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DB_HOST, PORT } from "@env";

const Intro2 = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/souq.jpg")} 
        style={styles.image}
      />
      <Image
        source={require("../assets/intro2title.jpg")}
        style={styles.headlineImage}
      />
      <Text style={styles.subheading}>
      Inviting all Innovators to showcase their unique ideas to explorers and offer them unforgettable experiences crafted just for them!
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Intro3')}>
        <Text style={styles.buttonText}>Next</Text>
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
    backgroundColor:'#8e9eef',
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