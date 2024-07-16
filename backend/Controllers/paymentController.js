const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../database/index');
const Business = db.Business;
const Payment = db.Payment;

const createPayment = async (req, res) => {
  const { amount, business_idbusiness, cardholderName, paymentMethodId } = req.body;

  try {
    const business = await Business.findByPk(business_idbusiness);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const payment = await Payment.create({
      amount,
      business_idbusiness,
      cardholderName,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_method: paymentMethodId,
      description: `Payment for ${business.businessName}`,

      metadata: {
        integration_check: 'accept_a_payment',
        business_id: business_idbusiness,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: error.message || 'Failed to process payment' });
  }
};

module.exports = {
  createPayment,
};