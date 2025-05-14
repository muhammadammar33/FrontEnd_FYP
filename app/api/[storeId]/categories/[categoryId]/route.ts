import {db} from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: Promise<{ categoryId: string }>}
) {
    try {
        const { categoryId } = await params; 
        if(!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }

        const category = await db.categories.findUnique({
            where: {
                Id: categoryId,
            },
        })

        return NextResponse.json(category);
    } catch (err) {
        console.log('[CATEGORY_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string, categoryId: string }>}
) {
    try {
        const user = await currentUser();
        const userId = user?.id;
        const body = await req.json();

        const { Name, BillBoardId } = body;
        const { storeId, categoryId } = await params; 

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!Name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // if (!BillBoardId) {
        //     return new NextResponse("Billboard URL is required", { status: 400 });
        // }

        if(!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
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

        const category = await db.categories.updateMany({
            where: {
                Id: categoryId
            },
            data: {
                Name,
            }
        })

        return NextResponse.json(category);
    } catch (err) {
        console.log('[CATEGORY_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, categoryId: string }>}
) {
    try {
        const user = await currentUser();
        const userId = user?.id;
        const { storeId, categoryId } = await params; 

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
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

        const category = await db.categories.deleteMany({
            where: {
                Id: categoryId,
            }
        })

        return NextResponse.json(category);
    } catch (err) {
        console.log('[CATEGORY_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}