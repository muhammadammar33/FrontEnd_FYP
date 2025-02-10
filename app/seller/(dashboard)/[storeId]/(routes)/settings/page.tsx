import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from '@/lib/db';
import { SettingsForm } from "./components/settings-form";

const SettingsPage = async ({ params }:{ params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;
    const user = await currentUser();
    const userId = user?.id;

    if(!userId) {
        redirect('/auth/Login');
    }

    const store = await db.stores.findFirst({
        where: {
            Id: storeId,
            UserId: userId
        }
    })

    if (!store) {
        redirect('/seller');
    }

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <SettingsForm initialData={store} />
            </div>
        </div>
    )
}

export default SettingsPage