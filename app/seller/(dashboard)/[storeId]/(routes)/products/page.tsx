import { format } from 'date-fns'
import { db } from '@/lib/db'
import { ProductClient } from './components/client'
import { ProductColumn } from './components/columns'
import { formatter } from '@/lib/utils'

const ProductsPage = async ({ 
    params
}: { 
    params: Promise<{ storeId: string }>
}) => {

    const { storeId } = await params;
    const products = await db.products.findMany({
        where: {
            StoreId: storeId,
        },
        include: {
            Categories: true,
            Sizes: true,
            Colors: true,
            Image: true
        },
        orderBy: {
            CreatedAt: 'desc'
        }
    })

    const formattedProducts: ProductColumn[] = products.map(item => ({
        id: item.Id,
        name: item.Name,
        isFeatured: item.IsFeatured,
        isArchived: item.IsArchived,
        price: formatter.format(Number(item.Price)),
        stock: item.Stock,
        category: item.Categories.Name,
        size: item.Sizes.Name,
        color: item.Colors.Value,
        createdAt: format(item.CreatedAt, "MMMM do, yyyy"),
        imageUrl: item.Image && item.Image.length > 0 
            ? item.Image[0].Url 
            : ""
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    )
}

export default ProductsPage;