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
    });

    // Check if any product is out of stock
    const outOfStockProducts = products.filter(product => product.Stock <= 0);
    if (outOfStockProducts.length > 0) {
        return new NextResponse(`Products out of stock: ${outOfStockProducts.map(p => p.Name).join(', ')}`, { status: 400 });
    }

    // Update the stock for each product
    for (const product of products) {
        await db.products.update({
            where: {
                Id: product.Id
            },
            data: {
                Stock: {
                    decrement: 1
                },
                UpdatedAt: new Date()
            }
        });
    }

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
            userId: User?.id ?? "", // Add userId from the User object
            IsPaid: true,
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