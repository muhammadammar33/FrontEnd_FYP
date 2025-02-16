import {db} from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: Promise<{ sizeId: string }>}
) {
    try {
        const { sizeId } = await params; 
        if(!sizeId) {
            return new NextResponse("Size id is required", { status: 400 });
        }

        const size = await db.sizes.findUnique({
            where: {
                Id: sizeId,
            }
        })

        return NextResponse.json(size);
    } catch (err) {
        console.log('[SIZE_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string, sizeId: string }>}
) {
    try {
        const user = await currentUser();
        const userId = user?.id;
        const body = await req.json();
        const { storeId, sizeId } = await params; 

        const { Name, Value } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!Name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!Value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        if(!sizeId) {
            return new NextResponse("Size id is required", { status: 400 });
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

        const size = await db.sizes.updateMany({
            where: {
                Id: sizeId
            },
            data: {
                Name,
                Value
            }
        })

        return NextResponse.json(size);
    } catch (err) {
        console.log('[SIZE_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, sizeId: string }>}
) {
    try {
        const user = await currentUser();
        const userId = user?.id;
        const { storeId, sizeId } = await params; 

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!sizeId) {
            return new NextResponse("Size id is required", { status: 400 });
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

        const size = await db.sizes.deleteMany({
            where: {
                Id: sizeId,
            }
        })

        return NextResponse.json(size);
    } catch (err) {
        console.log('[SIZE_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}