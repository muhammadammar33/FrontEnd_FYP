import { currentUser } from "@/lib/auth";
import {db} from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: Promise<{ colorId: string }>}
) {
    try {
        const { colorId } = await params; 

        if(!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
        }

        const color = await db.colors.findUnique({
            where: {
                Id: colorId,
            }
        })

        return NextResponse.json(color);
    } catch (err) {
        console.log('[COLOR_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string, colorId: string }>}
) {
    try {
        const user = await currentUser();
        const userId = user?.id;
        const body = await req.json();

        const { Name, Value } = body;
        const { storeId, colorId } = await params; 

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!Name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!Value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        if(!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
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

        const color = await db.colors.updateMany({
            where: {
                Id: colorId
            },
            data: {
                Name,
                Value
            }
        })

        return NextResponse.json(color);
    } catch (err) {
        console.log('[COLOR_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, colorId: string }>}
) {
    try {
        const user = await currentUser();
        const userId = user?.id;
        const { storeId, colorId } = await params; 

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!colorId) {
            return new NextResponse("Color id is required", { status: 400 });
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

        const color = await db.colors.deleteMany({
            where: {
                Id: colorId,
            }
        })

        return NextResponse.json(color);
    } catch (err) {
        console.log('[COLOR_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}