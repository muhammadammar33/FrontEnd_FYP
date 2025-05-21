import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const customers = await db.order.findMany({
            where: {
                StoreId: params.storeId,
                IsPaid: true,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    }
                },
                OrderItem: {
                    include: {
                        Products: {
                            select: {
                                Name: true,
                                Price: true
                            }
                        }
                    }
                }
            }
        });

        // Aggregate customer data
        const customerMap = new Map();
        
        customers.forEach(order => {
            const totalAmount = order.OrderItem.reduce((sum, item) => 
                sum + (Number(item.Products.Price) || 0), 0);

            // Create products array for this order
            const purchasedProducts = order.OrderItem.map(item => ({
                name: item.Products.Name,
                price: Number(item.Products.Price)
            }));

            if (customerMap.has(order.userId)) {
                const existing = customerMap.get(order.userId);
                existing.totalOrders += 1;
                existing.totalSpent += totalAmount;
                // Add products to existing customer's purchase history
                existing.purchasedProducts.push(...purchasedProducts);
            } else {
                customerMap.set(order.userId, {
                    id: order.userId,
                    name: order.user.name,
                    email: order.user.email,
                    phone: order.Phone,
                    address: order.Address,
                    totalOrders: 1,
                    totalSpent: totalAmount,
                    lastPurchase: order.CreatedAt,
                    purchasedProducts: purchasedProducts
                });
            }
        });

         const result = Array.from(customerMap.values());

        return NextResponse.json({
            success: true,
            customerCount: result.length,
            data: result
        });
    } catch (error) {
        return new NextResponse("Internal error", { status: 500 });
    }
}