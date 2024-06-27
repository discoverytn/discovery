import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

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

  const handleSubmit = async () => {
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
      Alert.alert("ImagePicker Error", "Failed to pick an image. Please try again.");
    }
  };
  

  const uploadImage = async (uri) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: uri.split("/").pop(), // Use the actual filename from the URI
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
        <Text style={styles.buttonText}>Select Business Image</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign up</Text>
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
            placeholder="Business Organization ID (BOid)"
            value={BOid}
            onChangeText={setBOid}
          />
          {renderImageItem()}
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  selectImageButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
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
});

export default SignupScreen;
