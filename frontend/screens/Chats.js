import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {useRoute} from '@react-navigation/native'

const Chats = ({navigation,route}) => {
  const { idbusiness, idexplorer, eventName } = route.params;
   console.log("routeeeeeeeeeeeeeeeeeeee",route.params);
  //  const idbusiness  = route.params
  //  const idexplorer = route.params

  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [socket, setSocket] = useState(null)
  console.log("idexplorer:", idexplorer)
  console.log("idbusiness:", idbusiness)
  useEffect(() => {
    const socket = io('http://192.168.26.72:3000')
    setSocket(socket)
    socket.on('message', (data) => {
      console.log("data:", data)
      setChatMessages([...chatMessages, data])
      })
  
      
  }, [idexplorer, idbusiness])



  const getMessage = () => {
    axios.post("http://192.168.26.72:3000/chat/get", { explorer_idexplorer: idexplorer, business_idbusiness: idbusiness })
      .then((res) => {
        setChatMessages(res.data)
      })
      .catch((err) => console.log(err));
  };

  const sendMessage = () => {
    if (message.length > 0) {
      socket.emit('message', { explorer_idexplorer: idexplorer, business_idbusiness:
        idbusiness, message: message })}
    console.log("Sending message:", message);
    setMessage("")
  console.log("ID of Explorer:", idexplorer);
  console.log("ID of Business:", idbusiness);

    if (!idexplorer || !idbusiness) {
      console.error("Missing idexplorer or idbusiness"); 
      return;
    }

     if (socket) {
      socket.emit("send-message", { message, explorer_idexplorer: idexplorer, business_idbusiness: idbusiness });
     }

    console.log("Sending message:", message);
    axios.post("http://192.168.26.72:3000/chat/send", {
      message,
      explorer_idexplorer: idexplorer,
      business_idbusiness : idbusiness
    })
      .then((res) => {
        console.log("Message sent:", res.data);
        setChatMessages([...chatMessages, res.data]);
        setMessage("");
      })
      .catch((err) => {
        console.log("Error sending message:", err)
        if (err.response) {
          console.log("Server responded with:", err.response.data)
        }

      });
  };

  useEffect(() => {
    const newSocket = io("http://192.168.26.72:3000");
    setSocket(newSocket);
    
    if (newSocket && idexplorer && idbusiness && eventName) {
      newSocket.emit('join-room', { eventName, idexplorer, idbusiness });
    }

    return () => {
      newSocket.close();
    }  }, []);

  useEffect(() => {
    if (socket) {
      getMessage();
  
      socket.on("receive-message", (newMessage) => {
        console.log("Received message:", newMessage);
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      });
  
      return () => {
        socket.disconnect();
      };
    }
  }, [socket]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {chatMessages.map((msg, index) => (
          <Text key={index}>{msg.message}</Text>
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
        <Pressable onPress={() => sendMessage(message)} style={styles.sendButton}>
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
  messageContainer: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  messageUser: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
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
    borderRadius: 5,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#32CD32",
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Chats;

