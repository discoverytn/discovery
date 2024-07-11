import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import axios from "axios";
import { DB_HOST, PORT } from "@env";

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();
  const [cardholderName, setCardholderName] = useState('');
  const [amount, setAmount] = useState('');
  const [cardDetails, setCardDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!cardDetails.complete || !amount || !cardholderName) {
      Alert.alert('Invalid Input', 'Please complete all the fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`http://${DB_HOST}:${PORT}/payment/create`, {
        amount: parseFloat(amount),
        business_idbusiness: 1, 
      });

      const { client_secret } = response.data;

      const { error, paymentIntent } = await confirmPayment(client_secret, {
        paymentMethodType: 'Card',
        billingDetails: { name: cardholderName },
      });

      if (error) {
        Alert.alert('Payment Error', error.message);
      } else if (paymentIntent) {
        Alert.alert('Payment Success', 'Your payment was successful!');
        // Optionally, navigate to success screen or perform further actions
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
          <Text style={styles.label}>Card Details</Text>
          <CardField
            postalCodeEnabled={false}
            placeholders={{ number: '4242 4242 4242 4242' }}
            cardStyle={styles.card}
            style={styles.cardContainer}
            onCardChange={(cardDetails) => setCardDetails(cardDetails)}
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
          disabled={loading} // Disable button during loading state
        >
          {loading ? 'Processing...' : 'Continue'}
        </Button>
      </View>
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
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    fontSize: 18,
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
