import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { APP_API_URL } from '../env';
import SessionStorage from 'react-native-session-storage';
import { io } from 'socket.io-client';
import AllChats from './AllChats';
import axios from 'axios';

const Chats = () => {
  const idexplorer = SessionStorage.getItem("idexplorer");
  const idbusiness = SessionStorage.getItem("idbusiness");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const getMessage = () => {
    axios.get(`${APP_API_URL}/chat/getmsg/${idexplorer}/${idbusiness}`)
      .then((res) => {
        setChatMessages(res.data);
      })
      .catch((err) => console.log(err));
  };

  const sendMessage = (message) => {
    if (socket) {
      socket.emit("send-message", message);
    }
    axios.post(`${APP_API_URL}/chat/send`, { 
      message, 
      idexplorer: idexplorer, 
      idbusiness: idbusiness 
    })
      .then((res) => {
        setMessage("");
        getMessage();
      })
      .catch((err) => console.log(err));
  };

  const handleAdd = () => {
    if (message.trim()) {
      sendMessage(message);
    }
  };

  useEffect(() => {
    const socketConnection = io("http://192.168.1.15:3000");
    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      console.log("Socket connected.");
    });

    socketConnection.on("disconnect", () => {
      console.log("Socket disconnected !");
    });

    return () => {
      if (socketConnection) {
        socketConnection.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    getMessage();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.messageContainer}>
          {chatMessages.length > 0 ? (
            <FlatList
              data={chatMessages}
              renderItem={({ item }) => <AllChats item={item} />}
              keyExtractor={(item) => item.id.toString()}
              inverted
            />
          ) : (
            <Text style={styles.noMessagesText}>There are no messages.</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            style={styles.textInput}
            onChangeText={(value) => setMessage(value)}
            placeholder="Type your message"
            placeholderTextColor="#7D848D"
          />
          <Pressable
            style={styles.sendButton}
            onPress={handleAdd}
          >
            <Text style={styles.sendButtonText}>SEND</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  messageContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  noMessagesText: {
    textAlign: 'center',
    marginTop: 100,
    color: '#7D848D',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "rgba(247, 247, 249, 1)",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1B1E28",
    fontWeight: "400",
    letterSpacing: 0.3,
    marginRight: 10,
    paddingVertical: 1,
  },
  sendButton: {
    backgroundColor: "#1B1E28",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#f2f0f1",
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Chats;
