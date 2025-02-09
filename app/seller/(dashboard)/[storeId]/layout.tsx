import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation"
import { db } from "@/lib/db";
import Navbar from '../../_components/navbar';

interface DashboardType {
    children: React.ReactNode;
    params: Promise<{ storeId: string }>
}

export default async function Dashboard({children, params}: DashboardType) {
    const user = await currentUser();
    const userId = user?.id;
    const { storeId } = await params;

    if (!userId) {
        redirect('/auth/Login')
    }

    const store = await db?.stores.findFirst({
        where: {
            Id: storeId,
            UserId: userId
        }
    })

    if (!store) {
        redirect('/seller');
    }

    return (
        <>
            {/* <Navbar /> */}
            {children}
        </>
    )
}