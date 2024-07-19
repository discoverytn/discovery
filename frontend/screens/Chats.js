import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native';
import { io } from 'socket.io-client';
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const Chats = ({ route }) => {
 
  const { explorer, business } = useAuth();
  const params = route.params || {};
  const { eventName, otherUserId } = params;

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  const currentUser = explorer || business;
  const idexplorer = explorer?.idexplorer || otherUserId;
  const idbusiness = business?.idbusiness || otherUserId;

  useEffect(() => {
    const socketInstance = io('http://192.168.100.5:3000');
    setSocket(socketInstance);

    socketInstance.on('receive-message', (newMessage) => {
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    if (idexplorer && idbusiness && eventName) {
      socketInstance.emit('join-room', { eventName, idexplorer, idbusiness });
    }

    return () => {
      socketInstance.disconnect();
    };
  }, [idexplorer, idbusiness, eventName]);

  useEffect(() => {
    if (idexplorer && idbusiness) {
      getMessage();
    }
  }, [idexplorer, idbusiness, eventName]);

  const getMessage = () => {
    console.log('Fetching messages for explorer:', idexplorer, 'and business:', idbusiness);
    axios.get("http://192.168.100.5:3000/chat/get", { 
      params: { 
        explorer_idexplorer: idexplorer, 
        business_idbusiness: idbusiness 
      }
    })
      .then((res) => {
        console.log('Received messages:', res.data);
        setChatMessages(res.data);
      })
      .catch((err) => {
        console.error('Error fetching messages:', err);
        // Optionally set an error state here
      });
  };

  const sendMessage = () => {
    if (!idexplorer || !idbusiness) {
      console.log("Missing idexplorer or idbusiness");
      return;
    }

    if (message.length > 0) {
      const newMessage = { 
        message, 
        explorer_idexplorer: idexplorer, 
        business_idbusiness: idbusiness
      };

      // Emit the message via socket
      if (socket) {
        socket.emit('send-message', {...newMessage, eventName});
      }

      // Send the message via API
      axios.post("http://192.168.100.5:3000/chat/send", {
        ...newMessage,
        eventName
      })
        .then((res) => {
          // Update local state with the new message
          setChatMessages((prevMessages) => [...prevMessages, res.data]);
          setMessage("");
        })
        .catch((err) => {
          if (err.response) {
            console.log("Server responded with:", err.response.data);
          }
          console.error('Error sending message:', err);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.messagesContainer}>
        {chatMessages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              msg.explorer_idexplorer === idexplorer ? styles.sentMessage : styles.receivedMessage
            ]}
          >
            <View style={styles.messageContent}>
              <Ionicons 
                name={msg.explorer_idexplorer === idexplorer ? 'person-circle' : 'business'} 
                size={24} 
                color="#000" 
                style={styles.icon} 
              />
              <View style={styles.messageTextContainer}>
                <Text style={styles.senderText}>
                  {msg.explorer_idexplorer === idexplorer ? explorer?.username : msg.Business?.username}
                </Text>
                <Text style={styles.messageText}>{msg.message}</Text>
                <Text style={styles.receiverText}>
                  {msg.business_idbusiness === idbusiness ? msg.Business?.username : explorer?.username}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
  style={styles.inputContainer}
>
  <TextInput
    style={styles.input}
    value={message}
    onChangeText={setMessage}
    placeholder="Message"
    placeholderTextColor="#8E8E93"
  />
  <Pressable onPress={sendMessage} style={styles.sendButton}>
    <Ionicons name="send" size={20} color="#FFFFFF" />
  </Pressable>
</KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  messagesContainer: {
    padding: 10,
    backgroundColor: "#F0F0F0",
  },
  messageContainer: {
    marginBottom: 10,
    maxWidth: '80%',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sentMessage: {
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 4,
  },
  messageTextContainer: {
    backgroundColor: '#E5E5EA',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sentMessageTextContainer: {
    backgroundColor: '#007AFF',
  },
  senderText: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    color: "#000000",
  },
  sentMessageText: {
    color: "#FFFFFF",
  },
  receiverText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#E5E5EA",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
export default Chats;