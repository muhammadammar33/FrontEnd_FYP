import {db} from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: Promise<{ billboardId: string }>}
) {
    try {
        const { billboardId } = await params;
        if(!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }

        const billboard = await db.billboards.findUnique({
            where: {
                Id: billboardId,
            }
        })

        return NextResponse.json(billboard);
    } catch (err) {
        console.log('[BILLBOARD_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string, billboardId: string }>}
) {
    try {
        const user = await currentUser();
        const userId = user?.id;
        const body = await req.json();
        console.log(body);
        console.log((await params).storeId);
        console.log((await params).billboardId);

        const { storeId, billboardId } = await params;

        const { Label, ImageUrl } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!Label) {
            console.log('Label is required');
            return new NextResponse("Label is required", { status: 400 });
        }

        if (!ImageUrl) {
            console.log('Image URL is required');
            return new NextResponse("Image URL is required", { status: 400 });
        }

        if(!billboardId) {
            console.log('Billboard id is required');
            return new NextResponse("Billboard id is required", { status: 400 });
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

        const billboard = await db.billboards.updateMany({
            where: {
                Id: billboardId
            },
            data: {
                Label: Label,
                ImageUrl: ImageUrl,
            }
        })

        return NextResponse.json(billboard);
    } catch (err) {
        console.log('[BILLBOARD_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, billboardId: string }>}
) {
    try {
        const user = await currentUser();
        const userId = user?.id;
        const { billboardId, storeId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
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

        const billboard = await db.billboards.deleteMany({
            where: {
                Id: billboardId,
            }
        })

        return NextResponse.json(billboard);
    } catch (err) {
        console.log('[BILLBOARD_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}