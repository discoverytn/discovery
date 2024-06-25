
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { loginAction } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginAction({ email, password });
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", error.message || "Login failed!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Log in to Discovery</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.loginText}>
          Don't have an account? <Text style={styles.loginLink}>Sign Up</Text>
        </Text>
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
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 20,
    width: "80%",
    maxWidth: 400,
  },
  button: {
    backgroundColor: "#00aacc",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
    width: "80%",
    maxWidth: 400,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    marginBottom: 20,
  },
  loginLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default LoginScreen;
