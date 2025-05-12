import { NextResponse } from "next/server";
import { getStoreSalesCount } from "@/actions/get-sales-count";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    const { storeId } = await params;
    const salesCount = await getStoreSalesCount(storeId);
    return NextResponse.json({ salesCount });
}
