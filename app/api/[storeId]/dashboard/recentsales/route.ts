import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { storeId: string } }) {
  const { storeId } = params;

  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const fetchAll = searchParams.get("fetchAll") === "true"; // Check if fetchAll is true
    
    const recentSales = await db.order.findMany({
      where: {
        StoreId: storeId,
      },
      orderBy: {
        CreatedAt: "desc",
      },
      take: fetchAll ? undefined : 5, // Fetch all if fetchAll is true, otherwise limit to 5
      select: {
        Id: true,
        CreatedAt: true,
        IsPaid: true,
        Phone: true,
        Address: true,
        user: {
          select: {
            name: true,
          },
        },
        OrderItem: {
          select: {
            Products: {
              select: {
                Name: true,
                Price: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ recentSales });
  } catch (error) {
    console.error("Error fetching recent sales:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent sales" },
      { status: 500 }
    );
  }
}
