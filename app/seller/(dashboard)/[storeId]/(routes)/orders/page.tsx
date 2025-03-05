import { format } from 'date-fns'
import {db} from '@/lib/db'
import { OrderClient } from './components/client'
import { OrderColumn } from './components/columns'
import { formatter } from '@/lib/utils'

const OrdersPage = async ({ 
    params
}: { 
    params: Promise<{ storeId: string }>
}) => {

    const { storeId } = await params;
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

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <OrderClient data={formattedOrders} />
            </div>
        </div>
    )
}

export default OrdersPage;