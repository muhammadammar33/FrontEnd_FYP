import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import {db} from "@/lib/db";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const user = await currentUser();
        const userId = user?.id;
        const body = await req.json();

        const { Name, Value } = body;
        const { storeId } = await params; 

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!Name) {
            return new NextResponse("Name is required", { status: 400});
        }

        if (!Value) {
            return new NextResponse("Value is required", { status: 400});
        }

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400});
        }

        const storeByUserId = await db.stores.findFirst({
            where: {
                Id: storeId,
                UserId: userId,
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const color = await db.colors.create({
            data : {
                Id: crypto.randomUUID(),
                Name,
                Value,
                StoreId: storeId,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            }
        })

        return NextResponse.json(color);

    } catch (err) {
        console.log(`[COLORS_POST] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params; 
        
        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400});
        }

        const colors = await db.colors.findMany({
            where: {
                StoreId: storeId
            }
        })

        return NextResponse.json(colors);

    } catch (err) {
        console.log(`[COLORS_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}