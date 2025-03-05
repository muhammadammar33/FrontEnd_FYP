import {db} from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request, { params }: { params: Promise<{ storeId: string }> }) {
    const { productIds } = await req.json();
    const { storeId } = await params; 

    if(!productIds || productIds.length === 0) {
        return new NextResponse("Product ids are required", { status: 400 });
    }

    const products = await db.products.findMany({
        where: {
            Id: {
                in: productIds
            }
        }
    })

    const Store = await db.stores.findFirst({
        where: {
            Id: storeId
        }
    })

    const User = await db.user.findFirst({
        where: {
            id: Store?.UserId
        }
    })

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((product) => {
        line_items.push({
            quantity: 1,
            price_data: {
                currency: 'PKR',
                product_data: {
                    name: product.Name,
                },
                unit_amount: Number(product.Price) * 100
            }
        })
    })

    const order = await db.order.create({
        data: {
            Id: crypto.randomUUID(), 
            StoreId: storeId,
            IsPaid: false,
            Phone: User?.phone ?? "", 
            Address: "", // Add appropriate address value
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            OrderItem: {
                create: productIds.map((productId: string) => ({
                    Id: crypto.randomUUID(),
                    Products: {
                        connect: {
                            Id: productId
                        }
                    }
                }))
            }
        }
    })

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        billing_address_collection: "required",
        phone_number_collection: {
            enabled: true,
        },
        success_url: `http://localhost:3000/store/${storeId}/cart?success=1`,
        cancel_url: `http://localhost:3000/store/${storeId}/cart?cancelled=1`,
        metadata: {
            orderId: order.Id
        }
    })

    return NextResponse.json({ url: session.url }, {
        headers: corsHeaders,
    })
}