import Stripe from "stripe";
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from "@/lib/stripe";
import {db} from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country,
    ];

    const addressString = addressComponents.filter(c => c !== null).join(', ');

    if(event.type === 'checkout.session.completed') {
        const order = await db.order.update({
            where: {
                Id: session?.metadata?.orderId,
            },
            data: {
                IsPaid: true,
                Address: addressString,
                Phone: session?.customer_details?.phone || ''
            },
            include: {
                OrderItem: true,
            }
        });

        const productIds = order.OrderItem.map(orderItem => orderItem.ProductId);

        await db.products.updateMany({
            where: {
                Id: {
                    in: [...productIds]
                },
            },
            data: {
                IsArchived: true,
                Stock: {
                    decrement: 1
                }
            }
        })
    }

    return new NextResponse(null, { status: 200 });
}