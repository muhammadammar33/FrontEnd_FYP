import { NextResponse } from "next/server";
import { getStoreRevenue } from "@/actions/get-total-revenue";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    const { storeId } = await params; 
    const totalRevenue = await getStoreRevenue(storeId);
    return NextResponse.json({ totalRevenue });
}
