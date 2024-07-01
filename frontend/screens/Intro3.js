import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Intro3 = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/sidibousaid.jpg")} 
        style={styles.image}
      />
      <Image
        source={require("../assets/intro3title.jpg")}
        style={styles.headlineImage}
      />
      <Text style={styles.subheading}>
      Don't let those special memories fade away use our app now and start creating lasting connections through shared experiences!
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')} >
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

export default Intro3;