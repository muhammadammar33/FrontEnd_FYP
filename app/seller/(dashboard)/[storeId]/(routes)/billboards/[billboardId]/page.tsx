import { db } from "@/lib/db";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({ params }: { params: { billboardId: string } }) => {
    const { billboardId } = params;
    
    const billboard = billboardId === "new" 
        ? null 
        : await db.billboards.findUnique({ 
            where: {
            Id: billboardId
            }
        });

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <BillboardForm initialData={billboard} />
            </div>
        </div>
    );
};

export default BillboardPage;