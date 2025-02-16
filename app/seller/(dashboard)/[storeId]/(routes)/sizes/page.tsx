import { format } from 'date-fns'
import {db} from '@/lib/db'
import { SizeClient } from './components/client'
import { SizeColumn } from './components/columns'

const SizesPage = async ({ 
    params
}: { 
    params: Promise<{ storeId: string }>
}) => {

    const { storeId } = await params;
    const sizes = await db.sizes.findMany({
        where: {
            StoreId: storeId,
        },
        orderBy: {
            CreatedAt: 'desc'
        }
    })

    const formattedSizes: SizeColumn[] = sizes.map(item => ({
        id: item.Id,
        name: item.Name,
        value: item.Value,
        createdAt: format(item.CreatedAt, "MMMM do, yyyy"),
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <SizeClient data={formattedSizes} />
            </div>
        </div>
    )
}

export default SizesPage;