import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { storeId: string } }) {
  const { storeId } = params;

  try {
    // Fetch inventory data for the store
    const inventoryData = await db.products.groupBy({
      by: ["CategoryId"],
      where: {
        StoreId: storeId,
      },
      _sum: {
        Stock: true,
      },
      _count: {
        Id: true,
      },
    });

    // Fetch category names for the inventory data
    const categories = await db.categories.findMany({
      where: {
        StoreId: storeId,
      },
      select: {
        Id: true,
        Name: true,
      },
    });

    // Map category names to inventory data
    const inventoryStatus = inventoryData.map((item) => {
      const category = categories.find((cat) => cat.Id === item.CategoryId);
      return {
        categoryName: category?.Name || "Unknown Category",
        stock: item._sum.Stock || 0,
        productCount: item._count.Id || 0,
      };
    });

    return NextResponse.json({ inventoryStatus });
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory data" },
      { status: 500 }
    );
  }
}