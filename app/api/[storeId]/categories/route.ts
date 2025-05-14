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
        console.log(body);
        console.log((await params).storeId);

        const { Name, BillboardId } = body; 
        const { storeId } = await params; 

        if (!userId) {
            console.log('Unauthenticated', userId);
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!Name) {
            console.log('Name is required', Name);
            return new NextResponse("Name is required", { status: 400});
        }

        // if (!BillboardId) {
        //     console.log('Billboard id is required', BillboardId);
        //     return new NextResponse("Billboard id is required", { status: 400});
        // }

        if (!storeId) {
            console.log('Store id is required', storeId);
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

        const category = await db.categories.create({
            data : {
                Id: crypto.randomUUID(),
                Name,
                StoreId: storeId,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            }
        })

        return NextResponse.json(category);

    } catch (err) {
        console.log(`[CATEGORIES_POST] ${err}`);
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

        const categories = await db.categories.findMany({
            where: {
                StoreId: storeId
            }
        })

        return NextResponse.json(categories);

    } catch (err) {
        console.log(`[CATEGORIES_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}