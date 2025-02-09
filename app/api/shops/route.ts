import {db} from "@/lib/db";
import { NextResponse } from "next/server"
import { useCurrentUser } from "@/hooks/use-current-user";

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string }>}
) {
    try {
        const user = useCurrentUser();
        const { storeId } = await params;
        const body = await req.json();

        const { userId } = user.id;

        const { Name, Description } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!Name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if(!storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const store = await db.stores.updateMany({
            where: {
                Id: storeId, 
                UserId: userId
            },
            data: {
                Name,
                Description
            }
        })

        return NextResponse.json(store);
    } catch (err) {
        console.log('[STORE_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    } finally {

    }
}

//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string }>}
) {
    try {
        const user = useCurrentUser();
        const { storeId } = await params;
        const { userId } = user.id;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        const store = await db.stores.deleteMany({
            where: {
                Id: storeId,
                UserId: userId
            }
        })

        return NextResponse.json(store);
    } catch (err) {
        console.log('[STORE_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    } finally {

    }
}