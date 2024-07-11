const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../database/index');
const Business = db.Business;
const Payment = db.Payment;

const createPayment = async (req, res) => {
  const {cardholderName, amount,business_idbusiness } = req.body;

  try {
    const business = await Business.findByPk(business_idbusiness);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const payment = await Payment.create({
      cardholderName,
      amount,
      business_idbusiness: business_idbusiness,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      cardholderName,
      amount: amount * 100, 
      currency: 'usd',
      description: `Payment for ${business.businessName}`,
      metadata: {
        integration_check: 'accept_a_payment',
        business_id: business_idbusiness,
      },
    });

    res.status(200).json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
};

module.exports = {
  createPayment,
};
