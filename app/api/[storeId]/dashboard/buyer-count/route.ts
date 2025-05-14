import { NextResponse } from "next/server";
import { getBuyers } from "@/actions/get-users";

export async function GET(
    req: Request,
) {
    const buyerCount = await getBuyers();
    return NextResponse.json({ buyerCount });
}
