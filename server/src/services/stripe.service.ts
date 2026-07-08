import Stripe from 'stripe';

const stripeKey = process.env.STRIPE_SECRET_KEY || '';
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

let stripe: Stripe | null = null;
if (stripeKey) {
  stripe = new Stripe(stripeKey, {
    apiVersion: '2024-04-10' as any,
  });
}

export const createCheckoutSession = async (
  orderId: string,
  items: Array<{ name: string; price: number; quantity: number }>,
  total: number,
  email: string
) => {
  if (!stripe) {
    console.log(`[STRIPE MOCK] Creating checkout session for Order: ${orderId}, Total: $${total}`);
    // Return a local client routing URL that simulates a successful payment
    return {
      id: `mock_session_${Date.now()}`,
      url: `${clientUrl}/checkout/success?orderId=${orderId}&session_id=mock_${Date.now()}`,
    };
  }

  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100), // Stripe takes amounts in cents
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: lineItems,
    customer_email: email,
    client_reference_id: orderId,
    success_url: `${clientUrl}/checkout/success?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/checkout/cancel?orderId=${orderId}`,
  });

  return {
    id: session.id,
    url: session.url,
  };
};

export const verifyWebhookSignature = (rawBody: Buffer, signature: string, secret: string) => {
  if (!stripe) {
    return null;
  }
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
};
