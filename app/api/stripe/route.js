import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const FORFAITS = {
  30: 120,
  60: 200,
  120: 350,
  240: 600,
}
const TARIF_MINUTE = 4 // centimes

export async function POST(req) {
  try {
    const { amount_cents: clientAmount, duration_minutes, mode, street, user_id, sensor_id } = await req.json()

    // Recalculer le montant côté serveur (ignorer la valeur du client)
    const safeCents = mode === 'fixed'
      ? FORFAITS[duration_minutes] || 120
      : Math.round(duration_minutes * TARIF_MINUTE)

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
          unit_amount: safeCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/error`,
      metadata: { user_id, sensor_id, duration_minutes, mode, street }
    })

    return Response.json({ url: session.url, session_id: session.id })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}