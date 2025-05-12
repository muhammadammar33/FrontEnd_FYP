import { NextResponse } from "next/server";
import { getStoreProductsCount } from "@/actions/get-total-products";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    const { storeId } = await params;
    const productCount = await getStoreProductsCount(storeId);
    return NextResponse.json({ productCount });
}
