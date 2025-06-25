import { currentUser } from "@/lib/auth";
import {db} from "@/lib/db";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: Promise<{ productId: string }>}
) {
    try {
        const { productId } = await params; 

        if(!productId) {
            return new NextResponse("Product id is required", { status: 400 });
        }

        const product = await db.products.findUnique({
            where: {
                Id: productId,
            },
            include: {
                Image: true,
                Categories: true,
                Colors: true
            }
        })

        return NextResponse.json(product);
    } catch (err) {
        console.log('[PRODUCT_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string, productId: string }>}
) {
    try {
        const user = await currentUser();
        const userId = user?.id;
        const body = await req.json();
        const { storeId, productId } = await params; 

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

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!Name) {
            return new NextResponse("Name is required", { status: 400});
        }

        if (!Price) new NextResponse("Price is required", { status: 400});

        if (!CategoryId) new NextResponse("Category id is required", { status: 400});

        if (!ColorId) new NextResponse("Color id is required", { status: 400});

        // if (!SizeId) new NextResponse("Size id is required", { status: 400});

        if (!IsFeatured) new NextResponse("Featured is required", { status: 400});

        if (!IsArchived) new NextResponse("Archived is required", { status: 400});

        if (!Images || !Images.length) {
            return new NextResponse("Image is required", { status: 400});
        }

        if(!productId) {
            return new NextResponse("Product id is required", { status: 400 });
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

        await db.products.update({
            where: {
                Id: productId
            },
            data : {
                Name,
                Image: {
                    deleteMany: {}
                },
                Price,
                Description,
                Stock,
                IsFeatured,
                IsArchived,
                CategoryId,
                SizeId: SizeId || null, // Make SizeId nullable if not provided
                ColorId,
                StoreId: storeId,
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            }
        })

        const product = await db.products.update({
            where: {
                Id: productId
            },
            data: {
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
            }
        })

        return NextResponse.json(product);
    } catch (err) {
        console.log('[PRODUCT_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

//// Delete Method

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, productId: string }>}
) {
    try {
        const user = await currentUser();
        const userId = user?.id;
        const { storeId, productId } = await params; 

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!productId) {
            return new NextResponse("Product id is required", { status: 400 });
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

        const product = await db.products.deleteMany({
            where: {
                Id: productId,
            }
        })

        return NextResponse.json(product);
    } catch (err) {
        console.log('[PRODUCT_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}