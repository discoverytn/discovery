import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, Animated } from 'react-native';
import { Icon } from 'react-native-elements';
import LeaderScreen from './LeaderScreen'; 
import LeaderScreen2 from './LeaderScreen2';
import RecommendedScreen from './RecommendedScreen';
import { DB_HOST, PORT } from "@env";
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const { width } = Dimensions.get('window');

const MainScreen = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const autoSwipe = setInterval(() => {
        if (flatListRef.current) {
          const nextIndex = (activeIndex + 1) % events.length;
          const offset = nextIndex * width;
          flatListRef.current.scrollToOffset({
            offset,
            animated: true,
          });
          setActiveIndex(nextIndex);
        }
      }, 4000); // Change slide every 5 seconds

      return () => clearInterval(autoSwipe);
    }
  }, [events, activeIndex]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`http://${DB_HOST}:${PORT}/events/getAll`);
      const fetchedEvents = response.data.map(event => ({
        id: event.idevents.toString(),
        eventName: event.eventName,
        imageUrl: event.image
      }));
      setEvents(shuffleArray(fetchedEvents));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.carouselItem, { transform: [{ scale }] }]}>
        <Image source={{ uri: item.imageUrl }} style={styles.carouselImage} />
        <Text style={styles.carouselItemText}>{item.eventName}</Text>
      </Animated.View>
    );
  };

  const onScrollEnd = (e) => {
    const contentOffset = e.nativeEvent.contentOffset;
    const viewSize = e.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setActiveIndex(pageNum);
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
          <Animated.FlatList
            ref={flatListRef}
            data={events}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            onMomentumScrollEnd={onScrollEnd}
            onScrollToIndexFailed={() => {}}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            snapToInterval={width}
            decelerationRate="fast"
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
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
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" type="font-awesome" color="#fff" size={24} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Categories')}>
          <Icon name="globe" type="font-awesome" color="#fff" size={24} />
          <Text style={styles.navText}>Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Discover')}>
          <Icon name="plus-square" type="font-awesome" color="#fff" size={24} />
          <Text style={styles.navText}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Favorites')}>
          <Icon name="heart" type="font-awesome" color="#fff" size={24} />
          <Text style={styles.navText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ScheduleEvent')}>
          <Icon name="calendar" type="font-awesome" color="#fff" size={24} />
          <Text style={styles.navText}>Event</Text>
        </TouchableOpacity>
      </LinearGradient>
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
    marginLeft: 130,
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
    backgroundColor: 'transparent',
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
    width: 30,
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
    width: width,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: width * 0.9,
    height: 180,
    borderRadius: 10,
  },
  carouselItemText: {
    position: 'absolute',
    bottom: 20,
    left: width * 0.05,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    padding: 5,
    borderRadius: 5,
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
    marginLeft: 12,
  },
});

export default MainScreen;