import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import {db} from "@/lib/db";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const user = await currentUser();
        const userId = user?.id;
        const body = await req.json();

        console.log(body);
        console.log((await params).storeId);

        const {
            Name,
            Price,
            Description,
            Stock,
            CategoryId,
            ColorId,
            SizeId,
            Images,
            IsFeatured,
            IsArchived
        } = body; 

        const { storeId } = await params; 

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!Name) {
            return new NextResponse("Name is required", { status: 400});
        }

        if (!Stock) new NextResponse("Stock is required", { status: 400});
        if (!Price) new NextResponse("Price is required", { status: 400});

        if (!CategoryId) new NextResponse("Category id is required", { status: 400});

        if (!ColorId) new NextResponse("Color id is required", { status: 400});

        if (!SizeId) new NextResponse("Size id is required", { status: 400});

        if (!IsFeatured) new NextResponse("Featured is required", { status: 400});

        if (!IsArchived) new NextResponse("Archived is required", { status: 400});

        // if (!images || !images.length) {
        //     return new NextResponse("Image is required", { status: 400});
        // }

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400});
        }

        const storeByUserId = await db.stores.findFirst({
            where: {
                Id: storeId,
                UserId: userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const product = await db.products.create({
            data : {
                Id: crypto.randomUUID(),
                Name,
                Image: {
                    createMany: {
                        data: Images.map((image: { url: string }) => ({
                            Id: crypto.randomUUID(),
                            Url: image.url,
                            CreatedAt: new Date(),
                            UpdatedAt: new Date()
                        }))
                    },        
                },
                Price,
                Description,
                Stock,
                IsFeatured,
                IsArchived,
                CategoryId,
                SizeId,
                ColorId,
                StoreId: storeId,
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            }
        })

        console.log("try to generate vector embeddings");
        const recommendations = await fetch(`http://localhost:3002/recommendations/embed/${product.Id}`)
        console.log("recommendations response", recommendations);
        return NextResponse.json(product);

    } catch (err) {
        console.log(`[PRODUCTS_POST] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params; 
        const { searchParams } = new URL(req.url);
        const CategoryId = searchParams.get('CategoryId') || undefined;
        const SizeId = searchParams.get('SizeId') || undefined;
        const ColorId = searchParams.get('ColorId') || undefined;
        const IsFeatured = searchParams.get('IsFeatured');

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400});
        }

        const products = await db.products.findMany({
            where: {
                StoreId: storeId,
                CategoryId,
                ColorId,
                SizeId,
                IsFeatured: IsFeatured ? true : undefined,
                IsArchived: false
            },
            include: {
                Image: true,
                Categories: true,
                Colors: true,
                Sizes: true
            },
            orderBy: {
                CreatedAt: 'desc'
            }
        })

        return NextResponse.json(products);

    } catch (err) {
        console.log(`[PRODUCTS_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}