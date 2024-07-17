import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useStripe, CardField } from '@stripe/stripe-react-native';
import axios from "axios";
import { DB_HOST, PORT } from "@env";
import { useAuth } from '../context/AuthContext';

const PaymentScreen = () => {
  const { confirmPayment, createPaymentMethod } = useStripe();
  const [cardName, setCardName] = useState('');
  const [amount, setAmount] = useState('');
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const { business } = useAuth();

  const handlePayment = async () => {
    if (!amount || !cardName) {
      Alert.alert('Invalid Input', 'Please enter cardholder name and amount.');
      return;
    }

    if (!cardDetails?.complete) {
      Alert.alert('Incomplete Card Details', 'Please enter all card information correctly.');
      return;
    }

    setLoading(true);

    try {
      const { paymentMethod, error: paymentMethodError } = await createPaymentMethod({
        paymentMethodType: 'Card',
        card: cardDetails,
        billingDetails: { name: cardName }
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      const response = await axios.post(`http://${DB_HOST}:${PORT}/payment/create`, {
        amount: parseFloat(amount),
        business_idbusiness: business.id,
        cardholderName: cardName,
        paymentMethodId: paymentMethod.id
      });

      const { client_secret } = response.data;

      const { error, paymentIntent } = await confirmPayment(client_secret, {
        paymentMethodType: 'Card',
        billingDetails: { name: cardName }
      });

      if (error) {
        throw new Error(error.message);
      } else if (paymentIntent) {
        Alert.alert('Payment Success', 'Your payment was successful!');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Payment Error', error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>Payment Page</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cardholder Name</Text>
            <TextInput
              value={cardName}
              onChangeText={setCardName}
              style={styles.input}
              theme={{ colors: { primary: '#00aacc', text: '#333333' } }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Card Information</Text>
            {/* <CardField
              postalCodeEnabled={true}
              placeholder={{
                number: '4242 4242 4242 4242',
              }}
              cardStyle={styles.cardField}
              style={styles.cardFieldContainer}
              onCardChange={(cardDetails) => {
                setCardDetails(cardDetails);
              }}
            /> */}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amount (USD)</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
              keyboardType="numeric"
              theme={{ colors: { primary: '#00aacc', text: '#333333' } }}
            />
          </View>
          <Button
            mode="contained"
            onPress={handlePayment}
            style={styles.payButton}
            contentStyle={styles.payButtonContent}
            labelStyle={styles.payButtonLabel}
            color="#00aacc"
            disabled={loading || !cardDetails?.complete}
          >
            {loading ? 'Processing...' : 'Pay'}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00aacc',
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
  cardFieldContainer: {
    height: 50,
    marginVertical: 10,
  },
  cardField: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  payButton: {
    margin: 24,
    borderRadius: 30,
    backgroundColor: '#00aacc',
    elevation: 4,
  },
  payButtonContent: {
    height: 56,
  },
  payButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default PaymentScreen;