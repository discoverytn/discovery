import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import AudioRecord from 'react-native-audio-record';

const Chats = ({ navigation, route }) => {
  const params = route.params || {};
  const { idbusiness, idexplorer, eventName } = params;

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioPath, setRecordedAudioPath] = useState(null);

  useEffect(() => {
    const socket = io('http://192.168.58.72:3000');
    setSocket(socket);

    socket.on('receive-message', (newMessage) => {
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
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
    axios.post("http://192.168.58.72:3000/chat/get", { explorer_idexplorer: idexplorer, business_idbusiness: idbusiness })
      .then((res) => {
        setChatMessages(res.data);
      })
      .catch((err) => console.log(err));
  };

  const sendMessage = () => {
    if (!idexplorer || !idbusiness) {
      console.error("Missing idexplorer or idbusiness");
      return;
    }

    if (message.length > 0) {
      if (socket) {
        socket.emit('send-message', { message, explorer_idexplorer: idexplorer, business_idbusiness: idbusiness });
      }

      axios.post("http://192.168.58.72:3000/chat/send", {
        message,
        explorer_idexplorer: idexplorer,
        business_idbusiness: idbusiness
      })
        .then((res) => {
          setChatMessages((prevMessages) => [...prevMessages, res.data]);
          setMessage("");
        })
        .catch((err) => {
          if (err.response) {
            console.log("Server responded with:", err.response.data);
          }
        });
    }
  };

  const startRecording = async () => {
    try {
      const audioFile = await AudioRecord.start();
      setIsRecording(true);
      setRecordedAudioPath(audioFile);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      const audioFile = await AudioRecord.stop();
      setIsRecording(false);
      setRecordedAudioPath(audioFile);
      // send the recorded audio file
      sendRecordedAudio(audioFile);
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  const sendRecordedAudio = (audioFilePath) => {
    //still the  logic to send recorded audio file
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
              {msg.explorer_idexplorer === idexplorer ? 'Explorer' : msg.Explorer?.username || msg.Business?.username}
            </Text>
            <Text style={styles.messageText}>{msg.message}</Text>
            <Text style={styles.receiverText}>
              {msg.business_idbusiness === idbusiness ? msg.Business?.username || msg.Explorer?.username : 'Business'}
            </Text>
          </View>
        ))}
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
        style={styles.inputContainer}
      >
        {isRecording ? (
          <Pressable onPress={stopRecording} style={styles.recordButton}>
            <Text style={styles.recordButtonText}>Stop</Text>
          </Pressable>
        ) : (
          <Pressable onPress={startRecording} style={styles.recordButton}>
            <Text style={styles.recordButtonText}>Record</Text>
          </Pressable>
        )}

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
});

export default Chats;
