import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { DB_HOST, PORT } from "@env";

const LeaderScreen2 = () => {
  const [topExplorers, setTopExplorers] = useState([]);

  useEffect(() => {
    fetchTopExplorers();
  }, []);

  const fetchTopExplorers = async () => {
    try {
      const response = await axios.get(`http://${DB_HOST}:${PORT}/explorer/topthree`);
      setTopExplorers(response.data);
    } catch (error) {
      console.error('Error fetching top explorers:', error);
    }
  };

  const renderExplorerCard = (explorer, index) => {
    const placeStyles = [styles.firstPlace, styles.secondPlace, styles.thirdPlace];
    const caretIcon = index === 0 ? "caret-up" : "caret-down";
    const caretColor = index === 0 ? "green" : "red";

    return (
      <View key={explorer.idexplorer} style={[styles.profileContainer, placeStyles[index]]}>
        <FontAwesome5 name={caretIcon} size={24} color={caretColor} style={styles.caretIcon} />
        <Text style={styles.rank}>{index + 1}</Text>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: explorer.image || 'https://cdn.vectorstock.com/i/1000v/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg' }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.username}>{explorer.firstname}</Text>
        <Text style={styles.score}>{explorer.postCount} posts</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Explorers Leaderboard</Text>
      </View>
      
      <View style={styles.leaderboardContainer}>
        {topExplorers.map((explorer, index) => renderExplorerCard(explorer, index))}
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
