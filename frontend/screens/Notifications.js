import * as React from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from '@react-navigation/native';

function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "comment",
      user: "Amjed, Slim, Zied",
      extra: "and 5 others",
      message: "commented on your post!",
      time: "1m ago",
      avatar: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      type: "like",
      user: "Lamjed, Mortadha",
      extra: "and 3 others",
      message: "liked your post.",
      time: "1m ago",
      avatar: "https://via.placeholder.com/50",
    },
    {
      id: 3,
      type: "join",
      user: "Ahmed",
      message: "wants to join your event, accept or decline!",
      time: "1m ago",
      avatar: "https://via.placeholder.com/50",
    },
    {
      id: 4,
      type: "featured",
      title: "Featured Business",
      message: "Please check our group of businesses",
      time: "10 Hrs ago",
      avatar: "https://via.placeholder.com/50",
    },
    {
      id: 5,
      type: "leaderboard",
      title: "Leaderboard",
      message: "You have reached our top 3 leaderboard",
      time: "15 Hrs ago",
      avatar: "https://via.placeholder.com/50",
    },
  ];

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notification</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image
            style={styles.headerIcon}
            source={{
              uri: "https://static.vecteezy.com/system/resources/previews/026/730/098/non_2x/orange-round-home-button-icon-vector.jpg",
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.tabContainer}>
        <Text style={styles.tabText}>General</Text>
        <View style={styles.tabBadge}>
          <Text style={styles.tabBadgeText}>5</Text>
        </View>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Image style={styles.avatar} source={{ uri: item.avatar }} />
            <View style={styles.notificationContent}>
              {item.type === "comment" || item.type === "like" ? (
                <>
                  <Text style={styles.notificationTitle}>
                    {item.user} {item.extra} {item.message}
                  </Text>
                  <Text style={styles.notificationTime}>{item.time}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                  <Text style={styles.notificationMessage}>{item.message}</Text>
                  <Text style={styles.notificationTime}>{item.time}</Text>
                </>
              )}
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    backgroundColor: "#47d2a6",
    borderRadius: 2,
    padding: 40,
    width: "101%",
    alignSelf: "stretch",
  },
  headerText: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    alignItems: "center",
    marginLeft: 90

  },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 2,
    marginBottom: 20,
    backgroundColor: '#aaafa6',
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 7
  },
  tabBadge: {
    backgroundColor: "#F8A435",
    borderRadius: 7,
    marginLeft: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tabBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  arrow: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    alignItems: "center",
  },
  notificationTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "grey",
    textAlign: "center",
  },
  notificationMessage: {
    fontSize: 14,
    color: "black",
    marginTop: 4,
    textAlign: "center",
  },
  notificationTime: {
    fontSize: 10,
    color: "#B4B9C1",
  },
});

export default Notifications;
