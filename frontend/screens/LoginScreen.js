import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Login = async () => {
    try {
      const payload = { email, password };
      const endpoint = "http://192.168.1.19:3000/auth/login";

      const response = await axios.post(endpoint, payload);

      if (response.status === 200) {
        const { token } = response.data;
        const decodedToken = jwtDecode(token);
        const { role } = decodedToken;

        if (role === "explorer") {
          navigation.navigate("Home"); // Badel
        } else if (role === "business") {
          navigation.navigate("Home"); // Badel
        } else if (role === "admin") {
          navigation.navigate("Home"); // Badel
        }
      } else {
        Alert.alert("Login Failed, Please re-check your info");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.header}>Log in to Discovery</Text>
        <Text style={styles.subHeader}>Enter your details below</Text>
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
        <TouchableOpacity style={styles.button} onPress={Login}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.loginText}>
            Don't have an account? <Text style={styles.loginLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loginContainer: {
    width: "80%",
    maxWidth: 400,
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
  },
  loginLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  forgotPasswordText: {
    textAlign: "center",
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default LoginScreen;
