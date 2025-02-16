import { format } from 'date-fns'
import {db} from '@/lib/db'
import { ColorClient } from './components/client'
import { ColorColumn } from './components/columns'

const ColorsPage = async ({ 
    params
}: { 
    params: Promise<{ storeId: string }>
}) => {

    const { storeId } = await params;
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

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <ColorClient data={formattedColors} />
            </div>
        </div>
    )
}

export default ColorsPage;