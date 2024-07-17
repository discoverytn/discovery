import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

const Chats = ({ navigation, route }) => {
  const { explorer, business } = useAuth();

  const params = route.params || {}
  const { eventName } = params

  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [socket, setSocket] = useState(null)

  const idexplorer = explorer.idexplorer;
  const idbusiness = business.idbusiness;

  useEffect(() => {
    const socketInstance = io('http://192.168.104.9:3000')
    setSocket(socketInstance)

    socketInstance.on('receive-message', (newMessage) => {
      setChatMessages((prevMessages) => [...prevMessages, newMessage])
    })

    if (idexplorer && idbusiness && eventName) {
      socketInstance.emit('join-room', { eventName, idexplorer, idbusiness })
    }

    return () => {
      socketInstance.disconnect()
    }
  }, [idexplorer, idbusiness, eventName])

  useEffect(() => {
    console.log("Explorer ID:", idexplorer);
    console.log("Business ID:", idbusiness);
    if (idexplorer && idbusiness) {
      getMessage();
    }
    getMessage()
  }, [idexplorer, idbusiness])

  const getMessage = () => {
    axios.get("http://192.168.104.9:3000/chat/get", { params: { explorer_idexplorer: idexplorer, business_idbusiness: idbusiness } })
      .then((res) => {
        setChatMessages(res.data)
      })
      .catch((err) => console.log(err))
  }

  const sendMessage = () => {
    if (!idexplorer ) {
      console.error("Missing idexplorer or idbusiness")
       return;
    }

    if (message.length > 0) {
      if (socket) {
        socket.emit('send-message', { message, explorer_idexplorer: idexplorer, business_idbusiness: idbusiness })
      }

      axios.post("http://192.168.104.9:3000/chat/send", {
        message,
        explorer_idexplorer: idexplorer,
        business_idbusiness: idbusiness,
        eventName
      })
        .then((res) => {
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
            <Text style={styles.senderText}>
              {msg.explorer_idexplorer === idexplorer ? explorer?.username : business?.username}
            </Text>
            <Text style={styles.messageText}>{msg.message}</Text>
            <Text style={styles.receiverText}>
              {msg.business_idbusiness === idbusiness ? msg.Business?.username : business?.username}
            </Text>
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
          placeholder="Type your message..."
        />
        <Pressable onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  messagesContainer: {
    padding: 10,
  },
  messageContainer: {
    padding: 8,
    borderRadius: 20,
    marginBottom: 10,
    maxWidth: '75%',
  },
  sentMessage: {
    backgroundColor: "#D1E7DD",
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: "#F8D7DA",
    alignSelf: 'flex-start',

  },
  senderText: {
    fontSize: 12,
    color: "#888888",
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: "#000000",
  },
  receiverText: {
    fontSize: 12,
    color: "#888888",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#EEEEEE",
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#32CD32",
    padding: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Chats;
