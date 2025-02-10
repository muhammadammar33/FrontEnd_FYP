import { format } from 'date-fns'
import { db } from "@/lib/db";
import { BillboardClient } from './components/client'
import { BillboardColumn } from './components/columns'

const BillboardsPage = async ({ 
    params
}: { 
    params: Promise<{ storeId: string }>
}) => {

    const { storeId } = await params;
    const billboards = await db.billboard.findMany({
        where: {
            StoreId: storeId,
        },
        orderBy: {
            CreatedAt: 'desc'
        }
    })

    const formattedBillboards: BillboardColumn[] = billboards.map(item => ({
        id: item.Id,
        label: item.Label,
        createdAt: format(item.CreatedAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <BillboardClient data={formattedBillboards} />
            </div>
        </div>
    )
}

export default BillboardsPage;