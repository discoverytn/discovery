import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
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
    const placeColors = [['#FFD700', '#FFA500'], ['#C0C0C0', '#A9A9A9'], ['#CD7F32', '#8B4513']];
    const caretIcon = index === 0 ? "caret-up" : "caret-down";
    const caretColor = index === 0 ? "#00FF00" : "#FF0000";

    return (
      <LinearGradient
        key={explorer.idexplorer}
        colors={placeColors[index]}
        style={styles.profileContainer}
      >
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
      </LinearGradient>
    );
  };

  return (
    <LinearGradient colors={['#1a2a6c', '#e6e9f0', '#eef1f5']} style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Explorers Leaderboard</Text>
      </View>
      
      <View style={styles.leaderboardContainer}>
        {topExplorers.map((explorer, index) => renderExplorerCard(explorer, index))}
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
    width: '90%',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    marginVertical: 10,
    padding: 15,
    elevation: 5,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  rank: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 15,
    color: '#FFFFFF',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: '#FFFFFF',
  },
  score: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  caretIcon: {
    marginRight: 10,
  },
});

export default LeaderScreen2;