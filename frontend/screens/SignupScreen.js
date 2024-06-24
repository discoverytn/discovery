import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

const SignupScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("explorer");
  const [businessName, setBusinessName] = useState("");
  const [BOid, setBOid] = useState("");
  const [credImg, setCredImg] = useState(null);

  const SignUp = async () => {
    try {
      let endpoint;
      let payload;

      if (role === "explorer") {
        endpoint = `http://${process.env.DB_HOST}:${PORT}/auth/register/explorer`;
        payload = { username: name, email, password };
      } else if (role === "business") {
        endpoint = `http://${process.env.DB_HOST}:${PORT}/auth/register/business`;
        const formData = new FormData();
        formData.append("username", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("businessName", businessName);
        formData.append("BOid", BOid);

        if (credImg) {
          const cloudinaryResponse = await uploadToCloudinary(credImg);
          formData.append("credImgUrl", cloudinaryResponse.secure_url);
        }

        payload = formData;
      } else {
        return Alert.alert("Please select a role to sign up");
      }

      const response = await axios.post(endpoint, payload);
      console.log("Signup successful", response.data);
      Alert.alert("Signup Successful", "You have successfully signed up!", [
        { onPress: () => navigation.navigate("LoginScreen") },
      ]);
    } catch (error) {
      console.error("signup error", error);
      Alert.alert("Signup Failed");
    }
  };

  const SelectImage = async () => {
    /// allow access to phone library
    try {
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!result.granted) {
        alert("Permission to access camera roll is required!");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        /// edit image before uploading (crop or adjusting size ...)
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
      });
      /// if the user didnt cancel the choosing operation
      if (!pickerResult.cancelled) {
        setCredImg(pickerResult);
      }
    } catch (error) {
      console.error("ImagePicker Error:", error);
      alert("an error occurred while choosing an image.");
    }
  };

  const uploadToCloudinary = async (imageData) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageData.uri,
      });
      formData.append("upload_preset", "discovery");
      /// cloudinary test in console
      console.log("ghghgh:", formData);

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dflixnywo/upload",
        formData
      );
      console.log("successful upload to Cloudinary :", response.data);
      return response.data;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign up now</Text>
      <Text style={styles.subHeader}>
        Please fill the details and create an account
      </Text>
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
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Text style={styles.passwordNote}>Password must be 8 characters</Text>

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
            placeholder="Business ID"
            value={BOid}
            onChangeText={setBOid}
          />
          <TouchableOpacity style={styles.input} onPress={SelectImage}>
            <Text style={styles.buttonText}>Select Business Image</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Explorer" value="explorer" />
          <Picker.Item label="Business Owner" value="business" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={SignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          Login
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 20,
  },
  passwordNote: {
    fontSize: 12,
    color: "#888",
    marginBottom: 20,
    textAlign: "center",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#00aacc",
    borderRadius: 6,
    marginBottom: 38,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
    paddingHorizontal: 10,
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
  loginText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  loginLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default SignupScreen;
