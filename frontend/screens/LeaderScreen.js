import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const LeaderScreen = () => {
  return (
    <View style={styles.container}>
      {/* Title Container */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Business Leaderboard</Text>
      </View>
      
      {/* Leaderboard Container */}
      <View style={styles.leaderboardContainer}>
        {/* Profile Card 1 */}
        <View style={[styles.profileContainer, styles.sideProfileContainer]}>
          <Image
            source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/029/271/062/small_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg' }}
            style={[styles.profileImage, styles.second]}
          />
          <Text style={styles.username}>Alex</Text>
          <Text style={styles.score}>270</Text>
          <Text style={styles.usernameTag}>@matrix</Text>
        </View>

        {/* Profile Card 2 */}
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

        {/* Profile Card 3 */}
        <View style={[styles.profileContainer, styles.sideProfileContainer]}>
          <Image
            source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/029/271/062/small_2x/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile-sign-business-concept-vector.jpg' }}
            style={[styles.profileImage, styles.third, styles.bronzeBorder]}
          />
          <Text style={styles.username}>Amine</Text>
          <Text style={styles.score}>150</Text>
          <Text style={styles.usernameTag}>@mramine</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#452E56',
    paddingTop: 60,
    alignItems: 'center',
  },
  titleContainer: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 6,
    borderColor: '#FFD700',
    alignItems: 'center',
    backgroundColor: '#FFD700', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#131A26',  
  },
  leaderboardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 20,
    marginTop:50
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: '#1E2736', 
    borderRadius: 10,
    padding: 10,
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
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  first: {
    borderWidth: 5,
    borderColor: '#F5D02E',
  },
  second: {
    borderWidth: 5,
    borderColor: '#8A94A6',
  },
  third: {
    borderWidth: 5,
    borderColor: '#34A853',
  },
  bronzeBorder: {
    borderColor: '#CD7F32',
  },
  crownIcon: {
    position: 'absolute',
    top: -30,
    zIndex: 1,
  },
  username: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  score: {
    color: '#F0A500',
    fontSize: 22,
    fontWeight: 'bold',
  },
  usernameTag: {
    color: '#5B6473',
    fontSize: 14,
  },
});

export default LeaderScreen;
