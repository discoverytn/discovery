// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, SafeAreaView, Alert } from 'react-native';
// import { TextInput, Button, Text } from 'react-native-paper';
// import { useStripe } from '@stripe/stripe-react-native';
// import axios from "axios";
// import { DB_HOST, PORT } from "@env";
// import { useAuth } from '../context/AuthContext';

// const PaymentScreen = () => {
//   const { initPaymentSheet, presentPaymentSheet } = useStripe();
//   const [cardholderName, setCardholderName] = useState('');
//   const [amount, setAmount] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { business } = useAuth();

//   useEffect(() => {
//     initializePaymentSheet();
//   }, []);

//   const initializePaymentSheet = async () => {
//     try {
//       const response = await axios.post(`http://${DB_HOST}:${PORT}/payment/create`, {
//         amount: parseFloat(amount) * 100, // Convert amount to cents
//         business_idbusiness: business.idbusiness
//       });

//       const { client_secret, ephemeralKey, customer } = response.data;

//       const { error } = await initPaymentSheet({
//         paymentIntentClientSecret: client_secret,
//         customerEphemeralKeySecret: ephemeralKey,
//         customerId: customer,
//       });

//       if (error) {
//         Alert.alert('Error', 'Failed to initialize payment sheet.');
//         console.error(error);
//       }
//     } catch (error) {
//       console.error('Error initializing payment sheet:', error);
//       Alert.alert('Error', 'Failed to initialize payment sheet. Please try again.');
//     }
//   };

//   const handleContinue = async () => {
//     if (!amount || !cardholderName) {
//       Alert.alert('Invalid Input', 'Please complete all the fields.');
//       return;
//     }

//     setLoading(true);

//     try {
//       const { error } = await presentPaymentSheet();

//       if (error) {
//         Alert.alert('Payment Error', error.message);
//       } else {
//         Alert.alert('Payment Success', 'Your payment was successful!');
//         // Handle success scenario, e.g., navigate to success screen
//       }
//     } catch (error) {
//       console.error('Error presenting payment sheet:', error);
//       Alert.alert('Payment Error', 'Failed to process payment. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Subscription Page</Text>
//       </View>

//       <View style={styles.form}>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Cardholder Name</Text>
//           <TextInput
//             value={cardholderName}
//             onChangeText={setCardholderName}
//             style={styles.input}
//             theme={{ colors: { primary: '#00aacc', text: '#333333' } }}
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Amount</Text>
//           <TextInput
//             value={amount}
//             onChangeText={setAmount}
//             style={styles.input}
//             keyboardType="numeric"
//             theme={{ colors: { primary: '#00aacc', text: '#333333' } }}
//           />
//         </View>

//         <Button
//           mode="contained"
//           onPress={handleContinue}
//           style={styles.continueButton}
//           contentStyle={styles.continueButtonContent}
//           labelStyle={styles.continueButtonLabel}
//           color="#00aacc"
//           disabled={loading}
//         >
//           {loading ? 'Processing...' : 'Continue'}
//         </Button>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#00aacc',
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     elevation: 4,
//   },
//   headerText: {
//     color: '#FFFFFF',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   form: {
//     padding: 24,
//   },
//   inputContainer: {
//     marginBottom: 24,
//   },
//   label: {
//     fontSize: 16,
//     color: '#333333',
//     marginBottom: 8,
//     fontWeight: '500',
//   },
//   input: {
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 2,
//     borderBottomColor: '#E0E0E0',
//     paddingVertical: 10,
//     fontSize: 18,
//     color: '#333333',
//   },
//   continueButton: {
//     margin: 24,
//     borderRadius: 30,
//     backgroundColor: '#00aacc',
//     elevation: 4,
//   },
//   continueButtonContent: {
//     height: 56,
//   },
//   continueButtonLabel: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
// });

// export default PaymentScreen;
