import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import {jwtDecode} from "jwt-decode"; 

const AuthContext = createContext({
  token: "",
  explorer: {},
  business: {},
  setExplorer: () => {},
  loginAction: () => {},
  signupAction: () => {},
  logOut: () => {},
});

const AuthProvider = ({ children }) => {
  const [explorer, setExplorer] = useState({});
  const [business, setBusiness] = useState({});
  const [token, setToken] = useState("");

  useEffect(() => {
    retrieveData();
  }, []);

  const storeData = async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
      console.log("Data stored successfully");
    } catch (error) {
      console.error("Error storing data:", error);
    }
  };

  const retrieveData = async () => {
    try {
      const storedExplorer = await SecureStore.getItemAsync("explorer");
      const storedBusiness = await SecureStore.getItemAsync("business");
      const storedToken = await SecureStore.getItemAsync("token");

      if (storedExplorer) setExplorer(JSON.parse(storedExplorer));
      if (storedBusiness) setBusiness(JSON.parse(storedBusiness));
      if (storedToken) setToken(storedToken);
    } catch (error) {
      console.error("Error retrieving data:", error);
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
  
        if ('id' in decodedToken) {
          const idValue = decodedToken['id'];
          if (decodedToken.role === 'explorer') {
            setExplorer((prev) => ({ ...prev, id: idValue }));
            console.log('Explorer ID set from context:', idValue);
          } else if (decodedToken.role === 'business') {
            setBusiness((prev) => ({ ...prev, id: idValue }));
            console.log('Business ID set from context:', idValue);
          }
        } else {
          console.error('ID not found in decoded token');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [token]);

  const loginAction = async (data) => {
    try {
      const response = await axios.post(
        "http://192.168.142.72:3000/auth/login",
        data
      );

      if (response.status === 200) {
        const { token } = response.data;
        Alert.alert("Success", response.data.message);

        if (response.data.business) {
          setBusiness(response.data.business);
          await storeData("business", response.data.business);
        } else if (response.data.explorer) {
          setExplorer(response.data.explorer);
          await storeData("explorer", response.data.explorer);
        } else {
          console.log("Unknown role or missing user data");
        }

        setToken(token);
        await storeData("token", token);

        return { token };
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.response?.data?.message || "Login failed!");
      throw err;
    }
  };

  const signupAction = async (data) => {
    console.log('Signup Data:', data);

    try {
      const endpoint =
        data.role === "explorer"
          ? "http://192.168.142.72:3000/auth/register/explorer"
          : "http://192.168.142.72:3000/auth/register/business";

      const response = await axios.post(endpoint, data);

      if (response.status === 201) {
        const { token } = response.data;
        Alert.alert("Success", "Signup successful!");

        return { token };
      } else {
        console.error("Unexpected response:", response);
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Signup error:", error);
      let errorMessage = "Failed to signup!";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      Alert.alert("Signup Failed", errorMessage);
      throw error;
    }
  };
  

  const logOut = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("explorer");
      await SecureStore.deleteItemAsync("business");

      setExplorer({});
      setBusiness({});
      setToken("");
      Alert.alert("Success", "Logged out successfully");
    } catch (error) {
      console.error("Error removing data:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, explorer, business, loginAction, signupAction,setExplorer, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
