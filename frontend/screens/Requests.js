import React from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  ScrollView,
} from "react-native";

const eventRequests = [
  {
    id: "1",
    name: "slim",
    time: "Sun,12:40pm",
    message: "Requested to join, Accept or Decline ?",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/3fa112a965dab6cb779f235b5841b3945b91c16ab18d6f422c5ab467a4ec9886?apiKey=53bf78c89509460b9f41a1591a48b10c&",
  },
  {
    id: "2",
    name: "Yesmine",
    time: "Mon,11:50pm",
    message: "Requested to join, Accept or Decline ?",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/5cb26c8bc6c83c1ca476b8c3c4c9ad949993186b136150518ab1398cc20a21dd?apiKey=53bf78c89509460b9f41a1591a48b10c&",
  },
  {
    id: "3",
    name: "Amjed",
    time: "Tue,10:56pm",
    message: "Requested to join, Accept or Decline ?",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/566b0258874afd996de6d3e0d7fc901037004d7a5e5e10dd12dc90cfb83f3cab?apiKey=53bf78c89509460b9f41a1591a48b10c&",
  },
  {
    id: "4",
    name: "Ameni",
    time: "Wed,12:40pm",
    message: "Requested to join, Accept or Decline ?",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d5bb0697f9932135611e0e5d9c7d34842eca476c6b66ac4b0e925cebaf84ef19?apiKey=53bf78c89509460b9f41a1591a48b10c&",
  },
  {
    id: "5",
    name: "nour eddine",
    time: "Fri,11:50pm",
    message: "Requested to join, Accept or Decline ?",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/e42e45788dda7e751c631781b3fc83580de99242ebbf6000e32bb82cad196c96?apiKey=53bf78c89509460b9f41a1591a48b10c&",
  },
  {
    id: "6",
    name: "Daloul matrix",
    time: "Sat,10:56pm",
    message: "Requested to join, Accept or Decline ?",
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/0be37684e78f548f158bffa40765a4474dc6fa7296d7abc99c9e51c11a132a23?apiKey=53bf78c89509460b9f41a1591a48b10c&",
  },
];

const Requests = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.timeContainer}>
          <Text style={styles.time}>9:41</Text>
        </View>
        <View style={styles.iconsContainer}>
          <Image
            resizeMode="contain"
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/b67447697c231937d5c6d55f4459b671f98d8c538365de02629ce3e4e6d95821?apiKey=53bf78c89509460b9f41a1591a48b10c&",
            }}
            style={styles.icon}
          />
          <Image
            resizeMode="contain"
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/4cb2fc6c231b65076cdc3280b9b40e136a5ea06acee38d40d8f268dc87afd33b?apiKey=53bf78c89509460b9f41a1591a48b10c&",
            }}
            style={styles.icon}
          />
          <Image
            resizeMode="contain"
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/69cbdbac9b590b8695f20e230f7f968fe198afdedc5cc27723a7c77c560d8535?apiKey=53bf78c89509460b9f41a1591a48b10c&",
            }}
            style={styles.icon}
          />
        </View>
      </View>
      <View style={styles.titleContainer}>
        <Image
          resizeMode="contain"
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/c059abed5f7b615ae7be8ecc943b421cbc700a774eb8d6276ce1e5602ca048f2?apiKey=53bf78c89509460b9f41a1591a48b10c&",
          }}
          style={styles.titleIcon}
        />
        <Text style={styles.title}>Event Requests</Text>
        <Pressable>
          <Text style={styles.clearAll}>Clear all</Text>
        </Pressable>
      </View>
      <Text style={styles.subtitle}>Event appliers</Text>
      <FlatList
        data={eventRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestContainer}>
            <Image
              resizeMode="contain"
              source={{ uri: item.avatar }}
              style={styles.avatar}
            />
            <View style={styles.requestTextContainer}>
              <View style={styles.requestHeader}>
                <Text style={styles.requestName}>{item.name}</Text>
                <Text style={styles.requestTime}>{item.time}</Text>
              </View>
              <Text style={styles.requestMessage}>{item.message}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeContainer: {
    flex: 1,
  },
  time: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  titleIcon: {
    width: 44,
    height: 44,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  clearAll: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D6EFD",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0D6EFD",
    marginTop: 20,
  },
  requestContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5F4FF",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  requestTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  requestName: {
    fontSize: 18,
    fontWeight: "500",
  },
  requestTime: {
    fontSize: 10,
    color: "#7D848D",
  },
  requestMessage: {
    fontSize: 13,
    color: "#7D848D",
    marginTop: 5,
  },
});

export default Requests;