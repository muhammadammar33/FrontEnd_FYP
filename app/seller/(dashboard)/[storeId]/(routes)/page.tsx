import Navbar from "../../../_components/navbar";
import SellerDashboard from "../../../_components/SellerDashboard";
import { format } from 'date-fns'
import { db } from '@/lib/db'
import { formatter } from '@/lib/utils'

type ProductColumn = {
    id: string
    name: string
    price: string
    size: string
    category: string
    color: string
    isFeatured: boolean
    isArchived: boolean
    createdAt: string
    stock: number
    imageUrl?: string
}

type OrderColumn = {
    id: string
    phone: string
    address: string
    isPaid: boolean
    totalPrice: string
    products: string
    createdAt: string
}

type CategoryColumn = {
    id: string
    name: string
    createdAt: string
}

type ColorColumn = {
    id: string
    name: string
    value: string
    createdAt: string
}

type BillboardColumn = {
    id: string
    Label: string
    imageUrl?: string
    CreatedAt: string
}

const SellerDashboardPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {

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

    const orders = await db.order.findMany({
        where: {
            StoreId: storeId,
        },
        include: {
            OrderItem: {
                include: {
                    Products: true
                }
            }
        },
        orderBy: {
            CreatedAt: 'desc'
        }
    })

    const formattedOrders: OrderColumn[] = orders.map(item => ({
        id: item.Id,
        phone: item.Phone,
        address: item.Address,
        products: item.OrderItem.map((orderItem) => orderItem.Products.Name).join(', '),
        totalPrice: formatter.format(item.OrderItem.reduce((total, item) => total + Number(item.Products.Price), 0)),
        isPaid: item.IsPaid,
        createdAt: format(item.CreatedAt, "MMMM do, yyyy"),
    }));

    const categories = await db.categories.findMany({
        where: {
            StoreId: storeId,
        },
        orderBy: {
            CreatedAt: 'desc'
        }
    })

    const formattedCategories: CategoryColumn[] = categories.map(item => ({
        id: item.Id,
        name: item.Name,
        createdAt: format(item.CreatedAt, "MMMM do, yyyy"),
    }));

    const colors = await db.colors.findMany({
        where: {
            StoreId: storeId,
        },
        orderBy: {
            CreatedAt: 'desc'
        }
    })

    const formattedColors: ColorColumn[] = colors.map(item => ({
        id: item.Id,
        name: item.Name,
        value: item.Value,
        createdAt: format(item.CreatedAt, "MMMM do, yyyy"),
    }));

    const billboards = await db.billboards.findMany({
        where: {
            StoreId: storeId,
        },
        orderBy: {
            CreatedAt: 'desc'
        }
    })

    const formattedBillboards: BillboardColumn[] = billboards.map(item => ({
        id: item.Id,
        Label: item.Label,
        imageUrl: item.ImageUrl,
        CreatedAt: format(item.CreatedAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <SellerDashboard 
                storeId={(await params).storeId} 
                products={formattedProducts} 
                orders={formattedOrders}
                categories={formattedCategories}
                colors={formattedColors}
                billboards={formattedBillboards}
            />
        </div>
    );
};

export default SellerDashboardPage;

