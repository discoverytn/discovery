import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useStripe } from '@stripe/stripe-react-native'; 
import axios from "axios";
import { DB_HOST, PORT } from "@env";
import { useAuth } from '../context/AuthContext';

const PaymentScreen = () => {
  const { createPaymentMethod, confirmPayment } = useStripe();
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { business } = useAuth();

  const handleContinue = async () => {
    // Check if all required fields are filled
    if (!cardholderName || !cardNumber || !expMonth || !expYear || !cvc || !amount) {
      Alert.alert('Invalid Input', 'Please complete all the fields.');
      return;
    }

    setLoading(true);

    try {
      const { paymentMethod, error: paymentMethodError } = await createPaymentMethod({
        type: 'Card',
        card: {
          number: cardNumber,
          expMonth: parseInt(expMonth),
          expYear: parseInt(expYear),
          cvc,
        },
        billingDetails: { name: cardholderName },
      });

      if (paymentMethodError) {
        Alert.alert('Payment Error', paymentMethodError.message);
        setLoading(false);
        return;
      }

      const response = await axios.post(`http://${DB_HOST}:${PORT}/payment/create`, {
        amount: parseFloat(amount),
        business_idbusiness: business.idbusiness,
        payment_method: paymentMethod.id,
      });

      const { client_secret } = response.data;

      // Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await confirmPayment(client_secret, {
        paymentMethodType: 'Card',
        paymentMethodId: paymentMethod.id,
      });

      if (confirmError) {
        Alert.alert('Payment Error', confirmError.message);
      } else if (paymentIntent) {
        Alert.alert('Payment Success', 'Your payment was successful!');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Payment Error', 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Add Payment Method</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cardholder Name</Text>
            <TextInput
              value={cardholderName}
              onChangeText={setCardholderName}
              style={styles.input}
              theme={{ colors: { primary: '#FF0000', text: '#333333' } }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              value={cardNumber}
              onChangeText={setCardNumber}
              style={styles.input}
              keyboardType="numeric"
              theme={{ colors: { primary: '#FF0000', text: '#333333' } }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Expiration Month</Text>
            <TextInput
              value={expMonth}
              onChangeText={setExpMonth}
              style={styles.input}
              keyboardType="numeric"
              theme={{ colors: { primary: '#FF0000', text: '#333333' } }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Expiration Year</Text>
            <TextInput
              value={expYear}
              onChangeText={setExpYear}
              style={styles.input}
              keyboardType="numeric"
              theme={{ colors: { primary: '#FF0000', text: '#333333' } }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CVC</Text>
            <TextInput
              value={cvc}
              onChangeText={setCvc}
              style={styles.input}
              keyboardType="numeric"
              theme={{ colors: { primary: '#FF0000', text: '#333333' } }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
              keyboardType="numeric"
              theme={{ colors: { primary: '#FF0000', text: '#333333' } }}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleContinue}
            style={styles.continueButton}
            contentStyle={styles.continueButtonContent}
            labelStyle={styles.continueButtonLabel}
            color="#000000"
            disabled={loading} 
          >
            {loading ? 'Processing...' : 'Continue'}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    paddingVertical: 20,
    paddingHorizontal: 16,
    elevation: 4,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
    fontSize: 18,
    color: '#333333',
  },
  continueButton: {
    margin: 24,
    borderRadius: 30,
    backgroundColor: '#000000',
    elevation: 4,
  },
  continueButtonContent: {
    height: 56,
  },
  continueButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default PaymentScreen;
