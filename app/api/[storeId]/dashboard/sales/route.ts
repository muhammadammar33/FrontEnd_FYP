import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { storeId: string } }) {
  const { storeId } = params;
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period"); // Get the period (daily, weekly, monthly, yearly)

  try {
    let startDate: Date | null = null;
    const endDate = new Date(); // Current date

    // Determine the start date based on the period
    if (period === "daily") {
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 1);
    } else if (period === "weekly") {
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
    } else if (period === "monthly") {
      startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1);
    } else if (period === "yearly") {
      startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);
    }

    // Validate start and end dates
    if (!startDate || !endDate) {
    throw new Error("Start date and end date must be provided.");
    }

    // Fetch sales data from the database
    const salesData = await db.order.findMany({
      where: {
        StoreId: storeId,
        CreatedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        Id: true,
        IsPaid: true,
        CreatedAt: true,
        OrderItem: {
          select: {
            Products: {
              select: {
                Price: true,
                Name: true,
              },
            },
          },
        },
      },
    });

    // Calculate total sales amount
    const totalSales = salesData.reduce((sum, order) => {
      const orderTotal = order.OrderItem.reduce((itemSum, item) => {
        return itemSum + (item.Products.Price ? Number(item.Products.Price) : 0);
      }, 0);
      return sum + orderTotal;
    }, 0);

    return NextResponse.json({ salesData, totalSales });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales data" },
      { status: 500 }
    );
  }
}