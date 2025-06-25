import { NextResponse } from "next/server";
import { getStoreBuyers } from "@/actions/get-users";

export async function GET(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    const { storeId } = params;
    const buyerCount = await getStoreBuyers(storeId);
    return NextResponse.json({ buyerCount });
}
