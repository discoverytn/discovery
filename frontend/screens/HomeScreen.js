import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, LogBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DB_HOST, PORT } from "@env";

export default function HomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
   
    LogBox.ignoreLogs([
      'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation',
    ]);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Plan your</Text>
        <Text style={styles.subtitle}>Next Adventure</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Intro1')}
        >
          <Text style={styles.buttonText}>Explore</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    padding: 20,
    alignItems: 'baseline',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#00aacc',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
