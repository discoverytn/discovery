import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, FlatList, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import LeaderScreen from './LeaderScreen'; 
import LeaderScreen2 from './LeaderScreen2';
import RecommendedScreen from './RecommendedScreen';
import { DB_HOST, PORT } from "@env";

const { width } = Dimensions.get('window');

const MainScreen = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselItems = [
    {
      id: '1',
      imageUrl: 'https://www.croatiaweek.com/wp-content/uploads/2021/06/ftf201-2.jpg?x69906',
    },
    {
      id: '2',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzDJxKQ1WRmK6zuBlQ8YaItFabx0jAez0AcQ&s',
    },
    {
      id: '3',
      imageUrl: 'https://onmilwaukee.com/images/articles/co/coffee-shops-with-patios-outdoor-seating/coffee-shops-with-patios-outdoor-seating_fullsize_story1.jpg',
    },
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
            <Image source={require('../assets/search.gif')} style={styles.searchImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationIcon}>
            <Image source={require('../assets/notification.gif')} style={styles.notificationImage} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title */}
      {/* <Text style={styles.title}>Discovery  🇹🇳</Text>
      <Image source={require('../assets/flag.gif')} style={styles.notificationImage} /> */}
      <View style={styles.headerContainer}>
      <Text style={styles.title}>Discovery</Text>
      <Image source={require('../assets/flag.gif')} style={styles.flagimage} />
    </View>
      
      {/* Content Section */}
      <ScrollView style={styles.scrollView}>
        <Image
          source={require('../assets/mainimg1.jpg')}
          style={styles.mainContentImage}
          resizeMode="contain"
        />

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Businesses on the Rise ➹</Text>
          <FlatList
            data={carouselItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled={false} 
            onScroll={(event) => {
              const index = Math.floor(event.nativeEvent.contentOffset.x / width);
              setActiveIndex(index);
            }}
          />
        </View>

        {/* Insert LeaderScreen Component */}
        <LeaderScreen />
        <LeaderScreen2 />
      
        {/* Add RecommendedScreen Component */}
        <RecommendedScreen navigation={navigation} />

        {/* Add padding to bottom for BottomNav */}
        <View style={{ paddingBottom: 80 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" type="font-awesome" color="#fff" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Categories')}>
          <Icon name="globe" type="font-awesome" color="#fff" />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Discover')}>
        <Icon name="plus-square" type="font-awesome" color="#fff"  />
        <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Favorites')}>
          <Icon name="heart" type="font-awesome" color="#fff" />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ScheduleEvent')}>
          <Icon name="calendar" type="font-awesome" color="#fff" />
          <Text style={styles.navText}>Event</Text>
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
  headerContainer: {
    marginLeft:130,
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: 'transparent', // Remove the white box
  },
  searchIcon: {
    marginRight: 10,
    backgroundColor: 'transparent', 
  },
  notificationImage: {
    width: 61, 
    height: 50,
  },
  searchImage: {
    width: 35,
    height: 30,
  },
  mainContentImage: {
    width: '89%',
    height: 180,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 6,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  carouselItem: {
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 10,
    position: 'relative',
  },
  carouselImage: {
    width: width * 0.95,
    height: 200,
    borderRadius: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#29738C',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    color: '#fff',
    fontSize: 12,
  },
  flagimage: {
    width: 30,
    height: 40,
    marginLeft:12
    
  },
});

export default MainScreen;
