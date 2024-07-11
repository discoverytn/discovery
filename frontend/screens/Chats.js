import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import  LottieView  from 'lottie-react-native';
import RecordAnimation from '../assets/Animation.json';
import AudioRecord from 'react-native-audio-record';

const Chats = ({ navigation, route }) => {
  const params = route.params || {};
  const { idbusiness, idexplorer, eventName } = params;
  const auth = useAuth();

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioPath, setRecordedAudioPath] = useState(null);

  useEffect(() => {
    const socket = io('http://192.168.58.72:3000');
    setSocket(socket);

    socket.on('receive-message', (newMessage) => {
      setChatMessages(prevMessages => [...prevMessages, newMessage]);
    });

    if (idexplorer && idbusiness && eventName) {
      socket.emit('join-room', { eventName, idexplorer, idbusiness });
    }

    return () => {
      socket.disconnect();
    };
  }, [idexplorer, idbusiness, eventName]);

  useEffect(() => {
    getMessage();
  }, [idexplorer, idbusiness]);

  const getMessage = () => {
    axios.get(`http://192.168.1.21:3000/api/chat/getmsg/${idexplorer}/${idbusiness}`)
      .then((res) => {
        setChatMessages(res.data);
      })
      .catch(err => console.log(err));
  };

  const sendMessage = (message) => {
    if (socket) {
      socket.emit("send-message", message);
    }
    axios.post(`http://192.168.1.21:3000/api/chat/send`, { 
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
    const socketConnection = io("http://192.168.1.21:3000");
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
    const fetchSessionData = async () => {
      const storedIdExplorer = await AsyncStorage.getItem("idexplorer");
      const storedIdBusiness = await AsyncStorage.getItem("idbusiness");
      setIdExplorer(storedIdExplorer);
      setIdBusiness(storedIdBusiness);
    };

    fetchSessionData();
    getMessage();
  }, []);

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
              {msg.explorer_idexplorer === idexplorer ? auth.explorer.username : msg.Business?.businessname}
            </Text>
            <Text style={styles.messageText}>{msg.message}</Text>
            <Text style={styles.receiverText}>
              {msg.business_idbusiness === idbusiness ? msg.Business?.businessname : auth.explorer.username}
            </Text>
          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
        style={styles.inputContainer}
      >
        <Pressable onPress={isRecording ? stopRecording : startRecording} style={styles.recordButton}>
          {isRecording ? (
            <LottieView
              source={RecordAnimation}
              style={styles.animation}
              autoPlay
              loop
            />
          ) : (
            <Text style={styles.recordButtonText}>Record</Text>
          )}
        </Pressable>

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
    padding: 10,
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
  recordButton: {
    backgroundColor: "#FF0000", 
    padding: 5,
    borderRadius: 20,
  },
  recordButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  animation: {
    width: 50, 
    height: 50,
  },
});

export default Chats;
