// import React, { useEffect, useState } from "react";
// import {
//   View,
//   StyleSheet,
//   Image,
//   Text,
//   TextInput,
//   Button,
//   FlatList,
// } from "react-native";
// import axios from "axios";

// const Chat = ({ explorer_idexplorer, business_idbusiness }) => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   const fetchMessages = async () => {
//     // try {
//     //   const response = await axios.get(
//     //     `http://localhost:3000/chat/chat/${explorer_idexplorer}/${business_idbusiness}`
//     //   );
//     //   setMessages(response.data);
//     // } catch (error) {
//     //   console.error("Error fetching messages:", error);
//     // }
//   };

//   const sendMessage = async () => {
//     try {
//       const response = await axios.post("http://localhost:3000/api/chat", {
//         explorer_idexplorer,
//         business_idbusiness,
//         message: newMessage,
//       });
//       setMessages([...messages, response.data]);
//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const selectImage = async (imageKey) => {
//     try {
//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: 'Images',
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });

//       console.log('ImagePicker result:', result);

//       if (!result.cancelled) {
//         const source = { uri: result.assets[0].uri };
//         console.log('Selected image URI:', source.uri);
//         uploadImage(source.uri, imageKey);
//       }
//     } catch (error) {
//       console.error('ImagePicker Error: ', error);
//     }
//   };
  
//   const uploadImage = async (uri, imageKey) => {
//     const formData = new FormData();
//     formData.append("file", {
//       uri,
//       type: "image/jpeg",
//       name: uri.split("/").pop(),
//     });
//     formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  
//     try {
//       const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
  
//       console.log("Upload response:", response);
  
//       if (response.status === 200) {
//         const imageUrl = response.data.secure_url;
//         setImages((prevImages) => ({
//           ...prevImages,
//           [imageKey]: { url: imageUrl },
//         }));
//       } else {
//         Alert.alert("Error", "Failed to upload image");
//       }
//     } catch (error) {
//       console.error("Image upload error:", error);
//       Alert.alert("Error", "An error occurred while uploading the image");
//     }
//   };
  
//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         keyExtractor={(item) => item.idchat.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.messageContainer}>
//             <Text style={styles.message}>{item.message}</Text>
//             <Text style={styles.timestamp}>{item.createdAt}</Text>
//           </View>
//         )}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type your message"
//           value={newMessage}
//           onChangeText={setNewMessage}
//         />
//         <Button title="Send" onPress={sendMessage} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "#fff",
//   },
//   messageContainer: {
//     padding: 10,
//     marginVertical: 5,
//     backgroundColor: "#f1f1f1",
//     borderRadius: 5,
//   },
//   message: {
//     fontSize: 16,
//   },
//   timestamp: {
//     fontSize: 12,
//     color: "#888",
//     textAlign: "right",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     marginRight: 10,
//   },
// });

// export default Chat;