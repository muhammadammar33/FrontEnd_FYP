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

        const { Label, ImageUrl } = body;
        const { storeId } = await params; 

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!Label) {
            return new NextResponse("Label is required", { status: 400});
        }

        if (!ImageUrl) {
            return new NextResponse("Image Url is required", { status: 400});
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

        const billboard = await db.billboard.create({
            data : {
                Id: crypto.randomUUID(),
                Label: Label,
                ImageUrl: ImageUrl,
                StoreId: storeId,
                CreatedAt: new Date(),
                UpdatedAt: new Date(),
            }
        })

        return NextResponse.json(billboard);

    } catch (err) {
        console.log(`[BILLBOARDS_POST] ${err}`);
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

        const billboards = await db.billboard.findMany({
            where: {
                StoreId: storeId
            }
        })

        return NextResponse.json(billboards);

    } catch (err) {
        console.log(`[BILLBOARDS_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}