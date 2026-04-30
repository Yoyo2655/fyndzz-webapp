import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { amount_cents, duration_minutes, mode, street, user_id, sensor_id } = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: mode === 'fixed'
              ? `Stationnement ${duration_minutes} min — ${street}`
              : `Stationnement à la minute — ${street}`,
            description: 'Payé via Fyndzz'
          },
          unit_amount: amount_cents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment`,
      metadata: { user_id, sensor_id, duration_minutes, mode, street }
    })

    return Response.json({ url: session.url, session_id: session.id })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}