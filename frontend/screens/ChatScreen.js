// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   Dimensions,
// } from 'react-native';

// const { width, height } = Dimensions.get('window');

// const MessageBubble = ({ isUser, content, time }) => (
//   <View style={isUser ? styles.userMessageContainer : styles.otherMessageContainer}>
//     <View style={styles.messageContent}>
//       <Text style={styles.messageText}>{content}</Text>
//     </View>
//     <View style={styles.messageTimeContainer}>
//       <Text style={styles.messageTime}>{time}</Text>
//       {/* {isUser && <Image source={require('../assets/checkmark.png')} style={styles.checkmarkIcon} />} */}
//     </View>
//   </View>
// );

// const ChatMessage = ({ sender, content, time, isUser }) => (
//   <View style={styles.chatMessageContainer}>
//     {!isUser && (
//       <View style={styles.senderInfo}>
//         <Text style={styles.senderName}>{sender}</Text>
//       </View>
//     )}
//     <MessageBubble isUser={isUser} content={content} time={time} />
//   </View>
// );

// const ChatScreen = () => {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([
//     { sender: "Sajib Rahman", content: "Hello!", time: "9:24", isUser: false },
//     { sender: "Sajib Rahman", content: "Thank you very much for your traveling, we really like the apartments. we will stay here for another 5 days...", time: "9:24", isUser: false },
//     { sender: "You", content: "Hello!", time: "9:34", isUser: true },
//     { sender: "You", content: "I'm very glad you like it👍", time: "9:35", isUser: true },
//     { sender: "Sajib Rahman", content: "We are arriving today at 01:45, will someone be at home?", time: "9:37", isUser: false },
//     { sender: "You", content: "I will be at home", time: "9:39", isUser: true },
//   ]);

//   const sendMessage = () => {
//     if (message.trim()) {
//       setMessages([
//         ...messages,
//         {
//           sender: "You",
//           content: message,
//           time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//           isUser: true
//         }
//       ]);
//       setMessage('');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView 
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.container}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
//       >
//         <View style={styles.statusBar}>
//           <Text style={styles.timeText}>9:41</Text>
//           <View style={styles.iconContainer}>
//             {/* <Image source={require('../assets/signal.png')} style={styles.statusIcon} />
//             <Image source={require('../assets/wifi.png')} style={styles.statusIcon} />
//             <Image source={require('../assets/battery.png')} style={styles.statusIcon} /> */}
//           </View>
//         </View>
//         <View style={styles.divider} />
//         <ScrollView style={styles.scrollView}>
//           <View style={styles.chatContainer}>
//             <View style={styles.avatarContainer}>
//               {/* <Image source={require('../assets/avatar1.png')} style={styles.avatarImage} />
//               <Image source={require('../assets/avatar2.png')} style={styles.avatarImage} />
//               <Image source={require('../assets/avatar3.png')} style={styles.avatarImage} /> */}
//             </View>
//             <View style={styles.messagesContainer}>
//               <View style={styles.dateContainer}>
//                 <Text style={styles.dateText}>Today</Text>
//               </View>
//               <FlatList
//                 data={messages}
//                 renderItem={({ item }) => <ChatMessage {...item} />}
//                 keyExtractor={(item, index) => index.toString()}
//                 contentContainerStyle={styles.flatListContent}
//               />
//             </View>
//           </View>
//         </ScrollView>
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.textInput}
//             placeholder="Type your message"
//             placeholderTextColor="#7D848D"
//             value={message}
//             onChangeText={setMessage}
//           />
//           <TouchableOpacity onPress={sendMessage}>
//             {/* <Image source={require('../assets/send.png')} style={styles.sendIcon} /> */}
//           </TouchableOpacity>
//         </View>
//         <View style={styles.bottomBar} />
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#FFF',
//   },
//   container: {
//     flex: 1,
//     borderRadius: 30,
//     backgroundColor: "#FFF",
//     width: "100%",
//     alignItems: "center",
//     padding: 18,
//   },
//   scrollView: {
//     flex: 1,
//     width: '100%',
//   },
//   statusBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     marginBottom: 20,
//   },
//   timeText: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#1B1E28",
//   },
//   iconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusIcon: {
//     width: 17,
//     height: 17,
//     marginLeft: 5,
//   },
//   divider: {
//     height: 2,
//     backgroundColor: "#F7F7F9",
//     width: '100%',
//     marginVertical: 24,
//   },
//   chatContainer: {
//     flexDirection: 'row',
//     width: '100%',
//     marginTop: 19,
//   },
//   avatarContainer: {
//     alignItems: 'center',
//   },
//   avatarImage: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginBottom: 46,
//   },
//   messagesContainer: {
//     flex: 1,
//     marginLeft: 20,
//   },
//   dateContainer: {
//     backgroundColor: "#F7F7F9",
//     borderRadius: 8,
//     paddingHorizontal: 13,
//     paddingVertical: 10,
//     alignSelf: 'center',
//     marginBottom: 16,
//   },
//   dateText: {
//     fontSize: 13,
//     color: "#7D848D",
//   },
//   flatListContent: {
//     paddingBottom: 20,
//   },
//   chatMessageContainer: {
//     marginBottom: 16,
//   },
//   senderInfo: {
//     marginBottom: 8,
//   },
//   senderName: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#1B1E28",
//   },
//   userMessageContainer: {
//     backgroundColor: "rgba(229, 244, 255, 1)",
//     alignSelf: 'flex-end',
//     borderRadius: 12,
//     padding: 15,
//     maxWidth: '80%',
//   },
//   otherMessageContainer: {
//     backgroundColor: "rgba(247, 247, 249, 1)",
//     alignSelf: 'flex-start',
//     borderRadius: 12,
//     padding: 15,
//     maxWidth: '80%',
//   },
//   messageContent: {
//     marginBottom: 5,
//   },
//   messageText: {
//     fontSize: 14,
//     color: "#1B1E28",
//   },
//   messageTimeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//   },
//   messageTime: {
//     fontSize: 12,
//     color: "#7D848D",
//   },
//   checkmarkIcon: {
//     width: 12,
//     height: 7,
//     marginLeft: 5,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: "rgba(247, 247, 249, 1)",
//     borderRadius: 16,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     marginTop: 20,
//     width: '100%',
//   },
//   textInput: {
//     flex: 1,
//     fontSize: 16,
//     color: "#1B1E28",
//   },
//   sendIcon: {
//     width: 24,
//     height: 24,
//   },
//   bottomBar: {
//     width: 134,
//     height: 5,
//     backgroundColor: "#1B1E28",
//     borderRadius: 100,
//     marginTop: 21,
//   },
// });

// export default ChatScreen;