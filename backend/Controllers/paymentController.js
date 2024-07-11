const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../database/index');
const Business = db.Business;
const Payment = db.Payment;

const createPayment = async (req, res) => {
  const { cardholderName, amount, business_idbusiness } = req.body;

  try {
    // Check if business exists
    const business = await Business.findByPk(business_idbusiness);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Create a record of the payment in your database
    const payment = await Payment.create({
      cardholderName,
      amount,
      business_idbusiness: business.idbusiness, // Use business.idbusiness
    });

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // amount in cents, round to avoid precision issues
      currency: 'usd',
      description: `Payment for ${business.businessName}`,
      payment_method_types: ['card'], // specify card payment method types
      metadata: {
        integration_check: 'accept_a_payment',
        business_id: business.idbusiness,
      },
    });

    // Update business subscribed field from 'no' to 'yes'
    await business.update({ subscribed: 'yes' });

    // Send client_secret back to the frontend
    res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
};

module.exports = {
  createPayment,
};
