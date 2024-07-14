import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DB_HOST, PORT } from "@env";

const LeaderScreen = () => {
  return (
    <LinearGradient colors={['#1a2a6c', '#b21f1f', '#fdbb2d']} style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Business Leaderboard</Text>
      </View>
      
      <View style={styles.leaderboardContainer}>
        <View style={[styles.profileContainer, styles.sideProfileContainer]}>
          <Image
            source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/029/271/062/small_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg' }}
            style={[styles.profileImage, styles.second]}
          />
          <Text style={styles.username}>Alex</Text>
          <Text style={styles.score}>270</Text>
          <Text style={styles.usernameTag}>@matrix</Text>
        </View>

        <View style={[styles.profileContainer, styles.middleProfileContainer]}>
          <View style={styles.profileImageContainer}>
            <FontAwesome5 name="crown" size={50} color="#FFD700" style={styles.crownIcon} />
            <Image
              source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/029/271/062/small_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg' }}
              style={[styles.profileImage, styles.first]}
            />
          </View>
          <Text style={styles.username}>Fraj</Text>
          <Text style={styles.score}>700</Text>
          <Text style={styles.usernameTag}>@chad</Text>
        </View>

        <View style={[styles.profileContainer, styles.sideProfileContainer]}>
          <Image
            source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/029/271/062/small_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg' }}
            style={[styles.profileImage, styles.third]}
          />
          <Text style={styles.username}>Amine</Text>
          <Text style={styles.score}>150</Text>
          <Text style={styles.usernameTag}>@mramine</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
    overflow: 'hidden',
  },
  titleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  leaderboardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    width: '30%',
  },
  sideProfileContainer: {
    marginTop: 30,
  },
  middleProfileContainer: {
    marginTop: -30,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  first: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  second: {
    borderWidth: 3,
    borderColor: '#C0C0C0',
  },
  third: {
    borderWidth: 3,
    borderColor: '#CD7F32',
  },
  crownIcon: {
    position: 'absolute',
    top: -40,
    zIndex: 1,
  },
  username: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  score: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  usernameTag: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 5,
  },
});

export default LeaderScreen;