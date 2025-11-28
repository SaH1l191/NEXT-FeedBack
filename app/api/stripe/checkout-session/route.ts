import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";



//  Where Verification Happens

// User Identity & Authentication: The first level of verification is done when checking if the user is authenticated (e.g., Clerk), and then whether they have an existing Stripe customer record.

// Stripe Customer Creation: Stripe verifies the customer's data when creating a new customer and ensuring the request is legitimate by authenticating the API call with your Stripe Secret Key.

// Checkout Session Creation: Stripe verifies the session details (customer, price, payment method types) when the session is created.

// Payment Verification: Stripe handles the payment authorization and may trigger 3D Secure or other forms of authentication as needed.

// Webhook Verification: Stripe sends verified events to your backend, and you verify the event signature to ensure the data came from Stripe.

// In summary, verification happens at multiple points:

// When checking if the user exists or creating a new customer.

// When the Checkout session is created (Stripe verifies the session).

// When the payment is processed (Stripe verifies payment and security).

// When you receive a webhook to confirm the payment’s success or failure.



//Stripe auth secret 

// When your backend sends a request to Stripe’s API (e.g., creating a customer, checkout session, or subscription), it includes this Secret Key in the request headers.

// Stripe uses the Secret Key to verify that the request is coming from an authorized source (i.e., your account).

// If the Secret Key is incorrect, expired, or missing, Stripe will reject the request.



//basic  payment methods required for creating a ccheckout session 
export async function POST(req: Request) {
    const { price, quantity = 1 } = await req.json();
    const { userId } = auth();

    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const userSubscription = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, userId),
    });
    let customer;
    if (userSubscription) {
        // get the stripe customer
        customer = {
            id: userSubscription.stripeCustomerId,
        };
    } else {
        // create user subscription
        const customerData: {
            metadata: {
                dbId: string;
            };
        } = {
            metadata: {
                dbId: userId,
            },
        };

        const response = await stripe.customers.create(customerData);

        customer = { id: response.id };

        await db.insert(subscriptions).values({
            userId,
            stripeCustomerId: customer.id,
        });
    }
    //process.env.NEXT_PUBLIC_BASE_URL || 
    const baseUrl = "http://localhost:3000";

    if (!customer?.id) {
        return new Response(JSON.stringify({ error: "Failed to get a customer id" }), { status: 500 });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            success_url: `${baseUrl}/payments/checkout-success`,
            customer: customer?.id,
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [
                {
                    price,
                    quantity,
                },
            ],
        });
        console.log('session from checkoutsession', session)

        if (session) {
            return new Response(JSON.stringify({ sessionId: session.id }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Failed to create a session" }), { status: 500 });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Failed to create a session" }), { status: 500 });
    }
}