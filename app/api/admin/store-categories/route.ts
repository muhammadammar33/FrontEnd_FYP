import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { z } from "zod";

const storeCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description } = storeCategorySchema.parse(body);

    const storeCategory = await db.storeCategories.create({
      data: {
        Name: name,
        Description: description || null,
        CreatedById: session.user.id,
      },
    });

    return NextResponse.json(storeCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    
    console.error("[STORE_CATEGORIES_POST]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const storeCategories = await db.storeCategories.findMany({
      orderBy: {
        Name: "asc",
      },
    });

    return NextResponse.json(storeCategories);
  } catch (error) {
    console.error("[STORE_CATEGORIES_GET]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
