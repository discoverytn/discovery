import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import { LineChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const MainScreen = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselItems = [
    {
      id: '1',
      imageUrl: 'https://circleboom.com/blog/content/images/size/w600/2022/12/best-linkedin-profile-examples.jpeg',
    },
    {
      id: '2',
      imageUrl: 'https://avatarfiles.alphacoders.com/150/150438.jpg',
    },
    {
      id: '3',
      imageUrl: 'https://avatarfiles.alphacoders.com/150/150438.jpg',
    },
  ];

  // Dummy leaderboard data
  const leaderboardData = [
    { id: '1', name: 'John Doe', posts: 120, imageUrl: 'https://img.freepik.com/premium-vector/male-model-icon-vector-image-can-be-used-modelling-agency_120816-262418.jpg' },
    { id: '2', name: 'Jane Smith', posts: 100, imageUrl: 'https://img.freepik.com/premium-vector/male-model-icon-vector-image-can-be-used-modelling-agency_120816-262418.jpg' },
    { id: '3', name: 'Michael Johnson', posts: 90, imageUrl: 'https://img.freepik.com/premium-vector/male-model-icon-vector-image-can-be-used-modelling-agency_120816-262418.jpg' },
  ];

  const renderItem = ({ item }) => {
    return (
      <View style={styles.carouselItem}>
        <Image source={{ uri: item.imageUrl }} style={styles.carouselImage} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile and Notification */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.profileCircle} onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{ uri: 'https://circleboom.com/blog/content/images/size/w600/2022/12/best-linkedin-profile-examples.jpeg' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={styles.username}>Username</Text>
        </View>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={styles.searchIcon}>
            <Image source={require('../assets/search.jpg')} style={styles.searchImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationIcon}>
            <Image source={require('../assets/notification.jpg')} style={styles.notificationImage} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Main Title</Text>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Businesses on the rise</Text>
        <FlatList
          data={carouselItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled={false} // Optional, to ensure no paging dots are shown
          onScroll={(event) => {
            const index = Math.floor(event.nativeEvent.contentOffset.x / width);
            setActiveIndex(index);
          }}
        />
      </View>

      {/* Leaderboard */}
      <View style={styles.leaderboardContainer}>
        <Text style={styles.leaderboardTitle}>Top Leaders</Text>
        {leaderboardData.map((leader, index) => (
          <View key={leader.id} style={styles.leaderboardItem}>
            <View style={styles.medalContainer}>
              {index === 1 && <Image source={require('../assets/silver_medal.jpg')} style={styles.medalImage} />}
              <Image source={{ uri: leader.imageUrl }} style={styles.profileImage} />
              {index === 0 && <Image source={require('../assets/gold_medal.jpg')} style={styles.medalImage} />}
              {index === 2 && <Image source={require('../assets/bronze_medal.jpg')} style={styles.medalImage} />}
            </View>
            <View style={styles.leaderDetails}>
              <Text style={styles.leaderName}>{leader.name}</Text>
              <Text style={styles.postsText}>{leader.posts} Posts</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" type="font-awesome" color="#fff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Categories')}>
          <Icon name="list" type="font-awesome" color="#fff" />
          <Text style={styles.navText}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Discover')}>
          <Icon name="search" type="font-awesome" color="#fff" />
          <Text style={styles.navText}>Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Favorites')}>
          <Icon name="heart" type="font-awesome" color="#fff" />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ScheduleEvent')}>
          <Icon name="calendar" type="font-awesome" color="#fff" />
          <Text style={styles.navText}>Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    marginLeft: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  notificationImage: {
    width: 30,
    height: 30,
  },
  searchImage: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  carouselItem: {
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 10,
    position: 'relative',
  },
  carouselImage: {
    width: width * 0.8,
    height: 200,
    borderRadius: 10,
  },
  leaderboardContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  medalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medalImage: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  leaderDetails: {
    marginLeft: 10,
  },
  leaderName: {
    fontSize: 16,
  },
  postsText: {
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#000',
    paddingVertical: 10,
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default MainScreen;
