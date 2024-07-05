import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; 

const LoginScreen = () => {
  const navigation = useNavigation();
  const { loginAction, token } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { token: authToken } = await loginAction({ email, password }); 

      if (authToken) {
        const decodedToken = jwtDecode(authToken);
        const userRole = decodedToken.role;

        if (userRole === "explorer") {
          navigation.navigate("explorerProfil");
        } else if (userRole === "business") {
          navigation.navigate("BusinessProfileScreen");
        } else {
          Alert.alert("Login Failed", "Unknown user role");
        }
      } else {
        Alert.alert("Login Failed", "Token not received");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", error.message || "Login failed!");
    }
  };

  const sendResetCode = async () => {
    try {
      const endpoint = `http://192.168.11.67:3000/auth/send-reset-code`;
      const payload = { email: resetEmail };

      const response = await axios.post(endpoint, payload);

      if (response.status === 200) {
        Alert.alert("Reset Code Sent", "Check your email for the reset code.");
        setShowResetForm(true);
      } else {
        Alert.alert(
          "Failed to Send Code",
          "Please check your email address and try again."
        );
      }
    } catch (error) {
      console.error("Send reset code error:", error);
      Alert.alert(
        "Failed to Send Code",
        "An error occurred. Please try again."
      );
    }
  };

  const verifyResetCode = async () => {
    try {
      const endpoint = `http://192.168.11.67:3000/auth/verify-code`;
      const payload = { email: resetEmail, code: resetCode };

      const response = await axios.post(endpoint, payload);

      if (response.status === 200) {
        Alert.alert("Code Verified", "You can now reset your password.");
        setShowNewPasswordForm(true);
      } else {
        Alert.alert("Invalid Code", "Please check your code and try again.");
      }
    } catch (error) {
      console.error("Verify reset code error:", error);
      Alert.alert(
        "Failed to Verify Code",
        "An error occurred. Please try again."
      );
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert(
        "Passwords do not match",
        "Please ensure both passwords match."
      );
      return;
    }

    try {
      const endpoint = `http://192.168.11.67:3000/auth/reset-password`;
      const payload = { email: resetEmail, newPassword };

      const response = await axios.post(endpoint, payload);

      if (response.status === 200) {
        Alert.alert(
          "Password Reset",
          "Your password has been reset successfully."
        );
        setShowResetForm(false);
        setShowNewPasswordForm(false);
        setResetEmail("");
        setResetCode("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        if (response.data.error === "SamePasswordError") {
          Alert.alert("Same Password Error", response.data.message);
        } else {
          Alert.alert("Failed to Reset Password", "Please try again later.");
        }
      }
    } catch (error) {
      console.error("Reset password error:", error);
      Alert.alert(
        "Failed to Reset Password",
        "Old password cannot be new password !"
      );
    }
  };

  const toggleResetForm = () => {
    setShowResetForm(!showResetForm);
    setShowNewPasswordForm(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        {!showResetForm ? (
          <>
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
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleResetForm}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {!showNewPasswordForm ? (
              <View>
                <Text style={styles.header}>Reset Password</Text>
                <Text style={styles.subHeader}>
                  Enter your email to receive a reset code
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChangeText={setResetEmail}
                />
                <TouchableOpacity style={styles.button} onPress={sendResetCode}>
                  <Text style={styles.buttonText}>Send Code</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  placeholder="Enter the code"
                  value={resetCode}
                  onChangeText={setResetCode}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={verifyResetCode}
                >
                  <Text style={styles.buttonText}>Verify Code</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={toggleResetForm}>
                  <Text style={styles.loginText}>Cancel Reset Password</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.header}>Set New Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new password"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm new password"
                  secureTextEntry
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                />
                <TouchableOpacity style={styles.button} onPress={resetPassword}>
                  <Text style={styles.buttonText}>Reset Password</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.loginText}>
            Don't have an account? <Text style={styles.loginLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
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
  forgotPasswordText: {
    textAlign: "center",
    color: "#007BFF",
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginBottom: 20,
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

export default LoginScreen;
