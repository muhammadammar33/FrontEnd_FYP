import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
    request: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { storeId } = params;

        console.log("Store ID: ", storeId); // Debugging

        // Update the store status to "APPROVED"
        const updatedStore = await db.stores.update({
        where: { Id: storeId },
        data: { Status: "ARCHIVED" },
        });

        return NextResponse.json(updatedStore);
    } catch (error) {
        console.error("[STORE_APPROVE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}