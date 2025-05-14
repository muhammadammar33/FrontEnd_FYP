import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { categoryId } = params;

    if (!categoryId) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    // Check if category is in use by any stores
    const storesUsingCategory = await db.stores.count({
      where: {
        StoreCategoryId: categoryId,
      },
    });

    if (storesUsingCategory > 0) {
      return NextResponse.json(
        { error: "Cannot delete category that is in use by stores" },
        { status: 400 }
      );
    }

    // Delete the store category
    await db.storeCategories.delete({
      where: {
        Id: categoryId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[STORE_CATEGORY_DELETE]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
