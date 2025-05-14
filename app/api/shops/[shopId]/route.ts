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

    const { Name, Description, StoreCategoryId, ImageUrl, Status } = body;

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

    // Prepare update data
    const updateData: any = {
      UpdatedAt: new Date()
    };

    // Only include fields that were provided in the request
    if (Name !== undefined) updateData.Name = Name;
    if (Description !== undefined) updateData.Description = Description;
    if (StoreCategoryId !== undefined) updateData.StoreCategoryId = StoreCategoryId || null;
    if (ImageUrl !== undefined) updateData.ImageUrl = ImageUrl || "";
    if (Status !== undefined) updateData.Status = Status;

    // Validate required fields for general updates (not status changes)
    if (Status === undefined && (Name === undefined || Description === undefined)) {
      return new NextResponse("Name and Description are required for general updates", { status: 400 });
    }

    // Update the store
    const updatedStore = await db.stores.update({
      where: {
        Id: shopId
      },
      data: updateData,
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
