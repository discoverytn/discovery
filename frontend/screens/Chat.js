import * as React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  TextInput,
} from "react-native";

const Chat=() =>{
    useEffect(()=>{},[])
  return (
    <View style={styles.view1}>
      <View style={styles.view2}>
        <View style={styles.view3}>
          <Text>9:41</Text>
        </View>
        <View style={styles.view4}>
          <Image
            resizeMode="auto"
            source={{
              uri: "",
            }}
            style={styles.image1}
          />
          <Image
            resizeMode="auto"
            source={{
              uri: "a.png",
            }}
            style={styles.image2}
          />
          <Image
            resizeMode="auto"
            source={{
              uri: "b.png",
            }}
            style={styles.image3}
          />
        </View>
      </View>
      <Image
        resizeMode="auto"
        source={{
          uri: "image4.png",
        }}
        style={styles.image4}
      />
      <View style={styles.view5}>
        <Image
          resizeMode="auto"
          source={{
            uri: "image5.png",
          }}
          style={styles.image5}
        />
        <View style={styles.view6}>
          <Text>“Event Name”</Text>
        </View>
      </View>
      <View style={styles.view7}>
        <View style={styles.view8}>
          <Image
            resizeMode="auto"
            source={{
              uri: "image6.png",
            }}
            style={styles.image6}
          />
          <Image
            resizeMode="auto"
            source={{
              uri: "image7.png",
            }}
            style={styles.image7}
          />
        </View>
        <View style={styles.view9}>
          <View style={styles.view10}>
            <View style={styles.view11}>
              <Text>Today</Text>
            </View>
            <View style={styles.view12}>
              <View style={styles.view13}>
                <Text>Alo!</Text>
              </View>
              <View style={styles.view14}>
                <View style={styles.view15}>
                  <Text>9:24</Text>
                </View>
                <Image
                  resizeMode="auto"
                  source={{
                    uri: "image8.png",
                  }}
                  style={styles.image8}
                />
              </View>
            </View>
          </View>
          <View style={styles.view16}>
            <View style={styles.view17}>
              <Text>9:30</Text>
            </View>
            <Image
              resizeMode="auto"
              source={{
                uri: "image9.png",
              }}
              style={styles.image9}
            />
          </View>
          <View style={styles.view18}>
            <View style={styles.view19}>
              <Text>Hello!</Text>
            </View>
            <View style={styles.view20}>
              <View style={styles.view21}>
                <Text>9:34</Text>
              </View>
              <Image
                resizeMode="auto"
                source={{
                  uri: "image10.png",
                }}
                style={styles.image10}
              />
            </View>
          </View>
          <View style={styles.view22}>
            <View style={styles.view23}>
              <Text>You’re welcome to come 👍</Text>
            </View>
            <View style={styles.view24}>
              <Text>9:35</Text>
            </View>
            <Image
              resizeMode="auto"
              source={{
                uri: "image11.png",
              }}
              style={styles.image11}
            />
          </View>
          <View style={styles.view25}>
            <View style={styles.view26}>
              <Text>We’ll be arriving today at 1 pm to the event</Text>
            </View>
            <View style={styles.view27}>
              <View style={styles.view28}>
                <Text>9:37</Text>
              </View>
              <Image
                resizeMode="auto"
                source={{
                  uri: "image12.png",
                }}
                style={styles.image12}
              />
            </View>
          </View>
          <View style={styles.view29}>
            <View style={styles.view30}>
              <Text>we’ll be waiting !</Text>
            </View>
            <View style={styles.view31}>
              <View style={styles.view32}>
                <Text>9:39</Text>
              </View>
              <Image
                resizeMode="auto"
                source={{
                  uri: "image13.png",
                }}
                style={styles.image13}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.view33}>
        <View style={styles.view34}>
          <Text>Type you message</Text>
        </View>
        <Image
          resizeMode="auto"
          source={{
            uri: "image14.png",
          }}
          style={styles.image14}
        />
      </View>
      <View style={styles.view35} />
    </View>
  );
}

const styles = StyleSheet.create({
  view1: {
    borderRadius: 30,
    backgroundColor: "#FFF",
    display: "flex",
    maxWidth: 480,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 auto",
    padding: "18px 0 8px 10px",
  },
  view2: {
    display: "flex",
    width: "100%",
    maxWidth: 324,
    alignItems: "stretch",
    gap: 20,
    justifyContent: "space-between",
  },
  view3: {
    color: "#1B1E28",
    textAlign: "center",
    font: "600 15px SF Pro Text, sans-serif ",
  },
  view4: { alignSelf: "start", display: "flex", alignItems: "start", gap: 5 },
  image1: {
    fill: "#1B1E28",
    position: "relative",
    width: 17,
    flexShrink: 0,
    aspectRatio: "1.54",
  },
  image2: {
    fill: "#1B1E28",
    position: "relative",
    width: 14,
    flexShrink: 0,
    aspectRatio: "1.27",
  },
  image3: {
    alignSelf: "stretch",
    position: "relative",
    width: 25,
    flexShrink: 0,
    aspectRatio: "2.08",
  },
  image4: {
    strokeWidth: 1.5,
    stroke: "#F7F7F9",
    borderColor: "rgba(247, 247, 249, 1)",
    borderStyle: "solid",
    borderWidth: 2,
    alignSelf: "stretch",
    position: "relative",
    marginTop: 24,
    aspectRatio: "100",
  },
  view5: {
    alignSelf: "start",
    display: "flex",
    width: 224,
    maxWidth: "100%",
    alignItems: "stretch",
    gap: 20,
    fontSize: 18,
    color: "#1B1E28",
    fontWeight: "500",
    textAlign: "center",
    margin: "19px 0 0 21px",
  },
  image5: { position: "relative", width: 44, flexShrink: 0, aspectRatio: "1" },
  view6: {
    fontFamily: "Inter, sans-serif",
    flexGrow: "1",
    flexShrink: "1",
    flexBasis: "auto",
    margin: "auto 0",
  },
  view7: { display: "flex", alignItems: "stretch", gap: 12 },
  view8: {
    alignSelf: "end",
    display: "flex",
    marginTop: 350,
    flexDirection: "column",
    alignItems: "center",
  },
  image6: {
    borderRadius: "50%",
    position: "relative",
    width: 48,
    aspectRatio: "1",
  },
  image7: {
    borderRadius: "50%",
    position: "relative",
    marginTop: 46,
    width: 48,
    aspectRatio: "1",
  },
  view9: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    flexGrow: "1",
    flexShrink: 0,
    flexBasis: 0,
    width: "fit-content",
  },
  view10: {
    alignSelf: "end",
    display: "flex",
    width: 167,
    maxWidth: "100%",
    flexDirection: "column",
    alignItems: "stretch",
    whiteSpace: "nowrap",
  },
  view11: {
    borderRadius: 8,
    backgroundColor: "#F7F7F9",
    alignItems: "stretch",
    color: "#8D8E91",
    font: "400 10px SF Pro Text, sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2px 8px",
  },
  view12: {
    display: "flex",
    width: "fit-content",
    maxWidth: "100%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  view13: {
    backgroundColor: "#F7F7F9",
    borderRadius: "0px 16px 16px 16px",
    padding: "12px 17px",
    textAlign: "center",
    whiteSpace: "pre-line",
    font: "400 14px SF Pro Text, sans-serif",
  },
  view14: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "stretch",
    padding: "5px 0 0 14px",
  },
  view15: {
    color: "#8D8E91",
    textAlign: "left",
    font: "400 10px SF Pro Text, sans-serif",
  },
  image8: {
    strokeWidth: 1.5,
    stroke: "#F7F7F9",
    alignSelf: "stretch",
    position: "relative",
    flexGrow: "1",
    flexShrink: 0,
    borderRadius: 2,
    width: 10,
    aspectRatio: "1",
  },
  view16: {
    display: "flex",
    width: "fit-content",
    maxWidth: "100%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  view17: {
    backgroundColor: "#F7F7F9",
    borderRadius: "16px 16px 16px 0px",
    textAlign: "center",
    whiteSpace: "pre-line",
    font: "400 14px SF Pro Text, sans-serif",
    padding: "12px 17px",
  },
  view18: {
    display: "flex",
    width: "fit-content",
    maxWidth: "100%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  view19: {
    backgroundColor: "#F7F7F9",
    borderRadius: "0px 16px 16px 16px",
    textAlign: "center",
    whiteSpace: "pre-line",
    font: "400 14px SF Pro Text, sans-serif",
    padding: "12px 17px",
  },
  view20: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "stretch",
    padding: "5px 0 0 14px",
  },
  view21: {
    color: "#8D8E91",
    textAlign: "left",
    font: "400 10px SF Pro Text, sans-serif",
  },
  image9: {
    strokeWidth: 1.5,
    stroke: "#F7F7F9",
    alignSelf: "stretch",
    position: "relative",
    flexGrow: "1",
    flexShrink: 0,
    borderRadius: 2,
    width: 10,
    aspectRatio: "1",
  },
  view22: {
    display: "flex",
    width: "fit-content",
    maxWidth: "100%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  view23: {
    backgroundColor: "#F7F7F9",
    borderRadius: "16px 16px 16px 0px",
    textAlign: "center",
    whiteSpace: "pre-line",
    font: "400 14px SF Pro Text, sans-serif",
    padding: "12px 17px",
  },
  view24: {
    color: "#8D8E91",
    textAlign: "left",
    font: "400 10px SF Pro Text, sans-serif",
    padding: "5px 0 0 14px",
  },
  image10: {
    strokeWidth: 1.5,
    stroke: "#F7F7F9",
    alignSelf: "stretch",
    position: "relative",
    flexGrow: "1",
    flexShrink: 0,
    borderRadius: 2,
    width: 10,
    aspectRatio: "1",
  },
  view25: {
    display: "flex",
    width: "fit-content",
    maxWidth: "100%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  view26: {
    backgroundColor: "#F7F7F9",
    borderRadius: "0px 16px 16px 16px",
    textAlign: "center",
    whiteSpace: "pre-line",
    font: "400 14px SF Pro Text, sans-serif",
    padding: "12px 17px",
  },
  view27: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "stretch",
    padding: "5px 0 0 14px",
  },
  view28: {
    color: "#8D8E91",
    textAlign: "left",
    font: "400 10px SF Pro Text, sans-serif",
  },
  image11: {
    strokeWidth: 1.5,
    stroke: "#F7F7F9",
    alignSelf: "stretch",
    position: "relative",
    flexGrow: "1",
    flexShrink: 0,
    borderRadius: 2,
    width: 10,
    aspectRatio: "1",
  },
  view29: {
    display: "flex",
    width: "fit-content",
    maxWidth: "100%",
    flexDirection: "column",
    alignItems: "stretch",
  },
  view30: {
    backgroundColor: "#F7F7F9",
    borderRadius: "16px 16px 16px 0px",
    textAlign: "center",
    whiteSpace: "pre-line",
    font: "400 14px SF Pro Text, sans-serif",
    padding: "12px 17px",
  },
  view31: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "stretch",
    padding: "5px 0 0 14px",
  },
  view32: {
    color: "#8D8E91",
    textAlign: "left",
    font: "400 10px SF Pro Text, sans-serif",
  },
  image12: {
    strokeWidth: 1.5,
    stroke: "#F7F7F9",
    alignSelf: "stretch",
    position: "relative",
    flexGrow: "1",
    flexShrink: 0,
    borderRadius: 2,
    width: 10,
    aspectRatio: "1",
  },
  view33: {
    borderRadius: 100,
    backgroundColor: "#F7F7F9",
    alignItems: "stretch",
    display: "flex",
    marginTop: 28,
    alignItems: "center",
    padding: "14px 30px",
  },
  view34: {
    width: "fit-content",
    alignSelf: "stretch",
    display: "flex",
    flexGrow: "1",
    flexShrink: "1",
    flexBasis: "auto",
    color: "#8D8E91",
    font: "400 17px SF Pro Text, sans-serif",
    alignItems: "center",
  },
  image13: {
    strokeWidth: 1.5,
    stroke: "#F7F7F9",
    position: "relative",
    width: 24,
    flexShrink: 0,
    aspectRatio: "1",
  },
  view35: { height: 10 },
});

export default Chat;