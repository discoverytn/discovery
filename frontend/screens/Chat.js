
import React from 'react';
import { SafeAreaView, View, Text, Pressable, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from './ChatStyles';
import AllChats from './AllChats';

const Chat = () => {
  const rooms = [
    {
      id: "1",
      name: "Novu Hangouts",
      messages: [
        {
          id: "1a",
          text: "Hello guys, welcome!",
          time: "07:50",
          user: "Tomer",
        },
        {
          id: "1b",
          text: "Hi Tomer, thank you! 😇",
          time: "08:50",
          user: "David",
        },
      ],
    },
    {
      id: "2",
      name: "Hacksquad Team 1",
      messages: [
        {
          id: "2a",
          text: "Guys, who's awake? 🙏🏽",
          time: "12:50",
          user: "Team Leader",
        },
        {
          id: "2b",
          text: "What's up? 🧑🏻‍💻",
          time: "03:50",
          user: "Victoria",
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.chatscreen}>
      <View style={styles.chattopContainer}>
        <View style={styles.chatheader}>
          <Text style={styles.chatheading}>Chats</Text>
          <Pressable onPress={() => console.log("Button Pressed!")}>
            <Feather name='edit' size={24} color='green' />
          </Pressable>
        </View>
      </View>

      <View style={styles.chatlistContainer}>
        {rooms.length > 0 ? (
          <FlatList
            data={rooms}
            renderItem={({ item }) => <AllChats item={item} />}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View style={styles.chatemptyContainer}>
            <Text style={styles.chatemptyText}>There are no chats!</Text>
            <Text>Please chat with the Business-Owner.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Chat;
