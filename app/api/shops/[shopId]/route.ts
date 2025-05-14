import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// GET a specific shop by ID
export async function GET(
  req: Request,
  { params }: { params: { shopId: string } }
) {
  try {
    const { shopId } = params;

    if (!shopId) {
      return new NextResponse("Shop ID is required", { status: 400 });
    }

    const shop = await db.stores.findUnique({
      where: {
        Id: shopId,
        // Status: "APPROVED"  // Only return approved shops
      },
      include: {
        StoreCategory: true,
        Products: {
          where: {
            IsArchived: false
          },
          include: {
            Image: true,
            Categories: true,
            Colors: true,
            Sizes: true
          }
        },
        Categories: true,
        Colors: true,
        Sizes: true,
        Billboards: true
      }
    });

    if (!shop) {
      return new NextResponse("Shop not found", { status: 404 });
    }

    return NextResponse.json(shop);
  } catch (err) {
    console.log('[SHOP_GET]', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}

// PATCH method for updating shop details
export async function PATCH(
  req: Request,
  { params }: { params: { shopId: string } }
) {
  try {
    const session = await auth();
    const { shopId } = params;
    const body = await req.json();

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!shopId) {
      return new NextResponse("Shop ID is required", { status: 400 });
    }

    const { Name, Description, StoreCategoryId, ImageUrl } = body;

    if (!Name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!Description) {
      return new NextResponse("Description is required", { status: 400 });
    }

    // Get the current store to verify ownership
    const currentStore = await db.stores.findUnique({
      where: {
        Id: shopId
      }
    });

    if (!currentStore) {
      return new NextResponse("Store not found", { status: 404 });
    }

    // Make sure the user owns this store
    if (currentStore.UserId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Update the store
    const updatedStore = await db.stores.update({
      where: {
        Id: shopId
      },
      data: {
        Name,
        Description,
        StoreCategoryId: StoreCategoryId || null,
        ImageUrl: ImageUrl || "",
        UpdatedAt: new Date()
      },
      include: {
        StoreCategory: true
      }
    });

    return NextResponse.json(updatedStore);
  } catch (err) {
    console.log('[SHOP_PATCH]', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}
