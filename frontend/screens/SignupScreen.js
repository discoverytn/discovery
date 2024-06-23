import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function SignupScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const SignUp = async () => {
    try {
      let endpoint;
      const payload = { username: name, email, password };

      if (role === 'explorer') {
        endpoint = 'http://localhost:3000/auth/register/explorer';
      } else if (role === 'business') {
       
        endpoint = 'http://localhost:3000/auth/register/business';
      } else {
       
        return Alert.alert('Select a role', 'Please select a role to sign up');
      }

      const response = await axios.post(endpoint, payload);
      console.log('Signup successful', response.data);
      Alert.alert('Signup Successful', 'You have successfully signed up!', [
        { text: 'OK', onPress: () => navigation.navigate('LoginScreen') },
      ]);
    } catch (error) {
      console.error('Signup error', error);
      Alert.alert('Signup Failed', 'An error occurred while signing up. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign up now</Text>
      <Text style={styles.subHeader}>Please fill the details and create an account</Text>
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
        Already have an account?{' '}
        <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
          Login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 20,
  },
  passwordNote: {
    fontSize: 12,
    color: '#888',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#00aacc',
    borderRadius: 6,
    marginBottom: 38,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#00aacc',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  loginLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});
