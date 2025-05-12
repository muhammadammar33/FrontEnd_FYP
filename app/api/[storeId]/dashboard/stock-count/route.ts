import { NextResponse } from "next/server";
import { getStoreStockCount } from "@/actions/get-stock-count";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    const { storeId } = await params;
    const stockCount = await getStoreStockCount(storeId);
    return NextResponse.json({ stockCount });
}
