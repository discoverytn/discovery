import 'react-native-gesture-handler';
import React ,{useState}from 'react';
import { StyleSheet, Text,TextInput,TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <Text style={styles.subHeader}>Please enter your details to login</Text>
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
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.loginText}>
        Don't have an account?{' '}
        <Text style={styles.loginLink} onPress={() => navigation.navigate('SignUp')}>
          Sign Up
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
    button: {
      backgroundColor: '#007BFF',
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
    },
    loginLink: {
      color: '#007BFF',
    },
    orConnectText: {
      textAlign: 'center',
      marginBottom: 20,
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    socialIcon: {
      width: 40,
      height: 40,
      marginHorizontal: 10,
    },
  });