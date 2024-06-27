import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext({
  token: "",
  explorer: {},
  business: {},
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
        console.log('Token:', token); 
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);

        
        if ('id' in decodedToken) {
          const idValue = decodedToken['id']; 
          setExplorer((prev) => ({ ...prev, id: idValue })); 
          console.log('Explorer ID:', idValue);
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
        "http://192.168.1.19:3000/auth/login",
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
    try {
      const endpoint =
        data.role === "explorer"
          ? "http://192.168.1.19:3000/auth/register/explorer"
          : "http://192.168.1.19:3000/auth/register/business";

      const response = await axios.post(endpoint, data);

      if (response.status === 201) {
        const { token } = response.data;
        Alert.alert("Success", response.data.message);

        if (data.role === "business") {
          setBusiness(response.data.business);
          await storeData("business", response.data.business);
        } else if (data.role === "explorer") {
          setExplorer(response.data.explorer);
          await storeData("explorer", response.data.explorer);
        }

        setToken(token);
        await storeData("token", token);

        return { token };
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.response?.data?.message || "Signup failed!");
      throw err;
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
      value={{ token, explorer, business, loginAction, signupAction, logOut }}
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