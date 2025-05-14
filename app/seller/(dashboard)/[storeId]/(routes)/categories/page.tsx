import { format } from 'date-fns'
import {db} from '@/lib/db'
import { CategoryClient } from './components/client'
import { CategoryColumn } from './components/columns'

const CategoriesPage = async ({ 
    params
}: { 
    params: Promise<{ storeId: string }>
}) => {

    const { storeId } = await params;
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

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <CategoryClient data={formattedCategories} />
            </div>
        </div>
    )
}

export default CategoriesPage;