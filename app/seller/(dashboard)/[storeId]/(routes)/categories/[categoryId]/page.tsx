import {db} from "@/lib/db";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({ params }: { params: Promise<{ categoryId: string, storeId: string }> }) => {
    const { categoryId, storeId } = await params;
    const category = categoryId === "new" 
        ? null 
        : await db.categories.findUnique({ 
            where: {
                Id: categoryId
            }
        });

    const billboards = await db.billboards.findMany({ 
        where: {
            StoreId: storeId
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <CategoryForm initialData={category} />
            </div>
        </div>
    )
}

export default CategoryPage;