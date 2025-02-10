import { db } from "@/lib/db";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({ params }: { params: { billboardId: string } }) => {
    const { billboardId } = params;

    // Check if billboardId is a special value (e.g., "new") that indicates a creation page
    const billboard = billboardId === "new" 
        ? null 
        : await db.billboard.findUnique({ 
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


// const BillboardPage = () => {
//     return (
//         <div className="flex-col">
//             <div className="flex-1 p-8 pt-6 space-y-4">
//                 <h1>This is a form page</h1>
//             </div>
//         </div>
//     )
// }
// export default BillboardPage;