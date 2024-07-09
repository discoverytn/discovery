import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const LeaderScreen2 = () => {
  return (
    <View style={styles.container}>
      {/* Title Container */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Explorers Leaderboard</Text>
      </View>
      
      {/* Leaderboard Container */}
      <View style={styles.leaderboardContainer}>
        {/* Profile Card 1 */}
        <View style={[styles.profileContainer, styles.firstPlace]}>
          <FontAwesome5 name="caret-up" size={24} color="green" style={styles.caretIcon} />
          <Text style={styles.rank}>1</Text>
          <View style={styles.profileImageContainer}>
             <Image
              source={{ uri: 'https://i.postimg.cc/8zxC2J2N/Untitled-1.png' }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.username}>Lamjed</Text>
          <Text style={styles.score}>20 posts</Text>
        </View>

        {/* Profile Card 2 */}
        <View style={[styles.profileContainer, styles.secondPlace]}>
          <FontAwesome5 name="caret-down" size={24} color="red" style={styles.caretIcon} />
          <Text style={styles.rank}>2</Text>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://i.postimg.cc/J0wTBqHt/Screenshot-2024-06-25-201110.png' }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.username}>Houssem</Text>
          <Text style={styles.score}>19 posts</Text>
        </View>

        {/* Profile Card 3 */}
        <View style={[styles.profileContainer, styles.thirdPlace]}>
          <FontAwesome5 name="caret-down" size={24} color="red" style={styles.caretIcon} />
          <Text style={styles.rank}>3</Text>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://i.postimg.cc/q7zQbY8z/Screenshot-2024-06-26-234920.png' }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.username}>Slim</Text>
          <Text style={styles.score}>6 posts</Text>
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
    width: '90%',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    marginVertical: 10,
    padding: 10,
  },
  firstPlace: {
    backgroundColor: '#FECB2E',
  },
  secondPlace: {
    backgroundColor: '#F5F6F7',
  },
  thirdPlace: {
    backgroundColor: '#FC6E27',
  },
  profileImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  score: {
    fontSize: 18,
  },
  caretIcon: {
    marginRight: 10,
  },
});

export default LeaderScreen2;
