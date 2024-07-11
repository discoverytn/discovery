const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../database/index');
const Business = db.Business;
const Payment = db.Payment;

const createPayment = async (req, res) => {
  const { amount, business_idbusiness } = req.body;

  try {
    // Check if business exists
    const business = await Business.findByPk(business_idbusiness);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Create a record of the payment in your database
    const payment = await Payment.create({
      amount,
      business_idbusiness: business_idbusiness,
    });

    // Create a PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: 'usd',
      description: `Payment for ${business.businessName}`,
      paymentMethodType: 'Card', // specify card payment
      metadata: {
        integration_check: 'accept_a_payment',
        business_id: business_idbusiness,
      },
    });

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
