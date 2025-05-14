import {db} from "@/lib/db";
import { NextResponse } from "next/server"
import { useCurrentUser } from "@/hooks/use-current-user";
import { auth } from "@/auth";

export async function POST(
    req: Request
) {
    try {
        // const user = useCurrentUser();
        const session = await auth();
        const body = await req.json();

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { Name, Description, StoreCategoryId, ImageUrl } = body;

        if (!Name) {
        return new NextResponse("Name is required", { status: 400 });
        }

        if (!Description) {
        return new NextResponse("Description is required", { status: 400 });
        }

        // Create the store in your database using Prisma
        const store = await db.stores.create({
        data: {
            Id: crypto.randomUUID(),
            Name,
            Description,
            StoreCategoryId,
            ImageUrl,
            UserId: session.user.id,
            Reason: "",
            Status: "PENDING",
            CreatedAt: new Date(),
            UpdatedAt: new Date()
        }
        });

        return NextResponse.json(store);
    } catch (err) {
        console.log('[STORE_POST]', err);
        return new NextResponse('Internal error', { status: 500 });
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
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
    { params }: { params: Promise<{ storeId: string }> }
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

// GET all shops
export async function GET() {
  try {
    const shops = await db.stores.findMany({
      include: {
        StoreCategory: true,
        Products: {
          where: {
            IsArchived: false
          },
          take: 4,
          include: {
            Image: true
          }
        }
      },
      where: {
        Status: "APPROVED"  // Only return approved shops
      },
      orderBy: {
        CreatedAt: 'desc'
      }
    });

    return NextResponse.json(shops);
  } catch (err) {
    console.log('[SHOPS_GET]', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}