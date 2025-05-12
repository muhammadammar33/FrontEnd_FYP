import { NextResponse } from "next/server";
import { getStoreGraphRevenue } from "@/actions/get-graph-revenue";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    const { storeId } = await params;
    const graphRevenue = await getStoreGraphRevenue(storeId);
    return NextResponse.json({ graphRevenue });
}
