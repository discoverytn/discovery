import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';

const CLOUDINARY_UPLOAD_PRESET = "discovery";
const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dflixnywo/image/upload";

const SignupScreen = () => {
  const { signupAction } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("explorer");
  const [businessName, setBusinessName] = useState("");
  const [BOid, setBOid] = useState("");
  const [credImg, setCredImg] = useState(null);
  const [category, setCategory] = useState("Restaurant");

  const navigation = useNavigation();

  const Submit = async () => {
    try {
      let payload;

      if (role === "explorer") {
        payload = { username: name, email, password, role };
      } else if (role === "business") {
        payload = {
          username: name,
          email,
          password,
          role,
          businessName,
          BOid,
          category,
          credImg: credImg ? credImg.uri : null,
        };
      } else {
        return Alert.alert("Please select a role to sign up");
      }

      console.log("Signup Payload:", payload);

      const { token } = await signupAction(payload);

      console.log("Signup successful with token:", token);
      Alert.alert("Signup Successful", "You have successfully signed up!");
      clearFields();
      navigation.navigate('Login');
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Signup Failed", "Failed to signup, please try again");
    }
  };

  const clearFields = () => {
    setName("");
    setEmail("");
    setPassword("");
    setBusinessName("");
    setBOid("");
    setCredImg(null);
    setCategory("Restaurant");
  };

  const selectImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log("ImagePicker result:", result);

      if (!result.cancelled) {
        const source = { uri: result.assets[0].uri };
        console.log("Selected image URI:", source.uri);
        uploadImage(source.uri);
      }
    } catch (error) {
      console.error("ImagePicker Error: ", error);
      Alert.alert(
        "ImagePicker Error",
        "Failed to pick an image. Please try again."
      );
    }
  };

  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: uri.split("/").pop(),
    });
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response);

      if (response.status === 200) {
        const imageUrl = response.data.secure_url;
        setCredImg({ uri: imageUrl });
      } else {
        Alert.alert("Error", "Failed to upload image");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      Alert.alert("Error", "An error occurred while uploading the image");
    }
  };

  const removeImage = () => {
    setCredImg(null);
  };

  const renderImageItem = () => (
    <View style={styles.imageContainer}>
      {credImg && (
        <>
          <Image
            source={{ uri: credImg.uri }}
            style={styles.selectedImage}
            resizeMode="cover"
          />
          <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
            <Text style={styles.removeImageText}>X</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity style={styles.selectImageButton} onPress={selectImage}>
        <Text style={styles.buttonText}>Business Doc Image</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.signupContainer}>
          <Text style={styles.header}>Sign up for Discovery</Text>
          <Text style={styles.subHeader}>Enter your details below</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Picker
            selectedValue={role}
            style={styles.input}
            onValueChange={(itemValue) => setRole(itemValue)}
          >
            <Picker.Item label="Explorer" value="explorer" />
            <Picker.Item label="Business" value="business" />
          </Picker>
          {role === "business" && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Business Name"
                value={businessName}
                onChangeText={setBusinessName}
              />
              <TextInput
                style={styles.input}
                placeholder="Business Owner ID"
                value={BOid}
                onChangeText={(text) => setBOid(text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
              />
              <Picker
                selectedValue={category}
                style={styles.input}
                onValueChange={(itemValue) => setCategory(itemValue)}
              >
                <Picker.Item label="Restaurant" value="Restaurant" />
                <Picker.Item label="Coffee Shop" value="Coffee Shop" />
                <Picker.Item label="Nature" value="Nature" />
                <Picker.Item label="Art" value="Art" />
                <Picker.Item label="Camping" value="Camping" />
                <Picker.Item label="Workout" value="Workout" />
                <Picker.Item label="Cycling" value="Cycling" />
              </Picker>
              {renderImageItem()}
            </>
          )}
          <TouchableOpacity style={styles.button} onPress={Submit}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLink}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  signupContainer: {
    width: "80%",
    maxWidth: 400,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#00aacc",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  selectImageButton: {
    backgroundColor: "#00aacc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "#fff",
    fontSize: 16,
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  loginText: {
    textAlign: "center",
  },
  loginLink: {
    color: "#007BFF",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default SignupScreen;