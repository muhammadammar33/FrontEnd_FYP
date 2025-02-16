import {db} from "@/lib/db";
import { SizeForm } from "./components/size-form";

const SizePage = async ({ params }: { params: Promise<{ sizeId: string }> }) => {
    const { sizeId } = await params;

    const size = sizeId === "new" 
        ? null 
        : await db.sizes.findUnique({ 
            where: {
                Id: sizeId
            }
        });

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <SizeForm initialData={size} />
            </div>
        </div>
    )
}

export default SizePage;