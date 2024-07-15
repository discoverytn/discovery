// import React from 'react';
// import { Text, View, Pressable, StyleSheet , TextInput } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const AllChats = ({ item }) => {
//   const navigation = useNavigation();

//   if (!item) {
//     return null;
//   }

//   const handleNavigation = () => {
//     navigation.navigate("Chats", {
//       idexplorer: item.explorer_idexplorer,
//     });
//   };

//   return (
    
//     <Pressable style={styles.cchat} onPress={handleNavigation}>

//       <Ionicons
//         name='person-circle-outline'
//         size={55}
//         color='black'
//         style={styles.cavatar}
//       />
//       <View style={styles.crightContainer}>
//         <View>
//           <Text style={styles.cusername}>{item.explorer_idexplorer}</Text>
         
//           <Text style={styles.cmessage}>{item?.message || "Tap to start chatting"}</Text>
//         </View>
//         <View>
//           <Text style={styles.ctime}>{item?.createdAt || "now"}</Text>
//         </View>
//       </View>
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   cchat: {
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     marginBottom: 10,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//     elevation: 2,
//   },
//   cavatar: {
//     marginRight: 15,
//   },
//   crightContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   cusername: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   cmessage: {
//     fontSize: 14,
//     color: '#999',
//     marginTop: 3,
//   },
//   ctime: {
//     fontSize: 12,
//     color: '#777',
//     marginTop: 1,
//   },
// });

// export default AllChats;

import React, {useState,useEffect} from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./ChatStyles";
import { useNavigation } from "@react-navigation/native";
import {io} from 'socket.io-client';



const AllChats = ({item}) => {
    const navigation = useNavigation();
    console.log("testitem",item);
  
    const handleNavigation = () => {
        navigation.navigate("Chats", {
            idexplorer: item.idexplorer,
            
        });
    };
    const handleCreateRoom = () => {
        socket.emit("createRoom", "test");
        
    };
    
    const socket = io("http://192.168.1.15:3000");
    console.log(socket,"socketttttt");
    useEffect(()=>{
        try {
            const socket = io("http://192.168.1.15:3000");
          
            console.log("socket=>",socket);} 
        catch (error) {
            console.log(error);
        }
    console.log('hi')
    },[])
  return (
    <Pressable style={styles.cchat} 
    onPress={()=>{handleCreateRoom(),handleNavigation()}}
    >
        <Ionicons
            name='person-circle-outline'
            size={45}
            color='black'
            style={styles.cavatar}
        />

        <View style={styles.crightContainer}>
            <View>
                
                {/* <Text style={styles.cusername}>{item.explorer}</Text> */}
                <Text style={styles.name}>{item.explorer}</Text>


                <Text style={styles.cmessage}>
                    {item?.message ? item.message : "Tap to start chatting"}
                </Text>
            </View>
            <View>
                <Text style={styles.ctime}>
                    {item?.time ? item.time : "now"}
                </Text>
            </View>
        </View>
    </Pressable>
)}
export default AllChats
