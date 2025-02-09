import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation"
import { db } from "@/lib/db";
import Navbar from "../_components/navbar";

interface DashboardType {
    children: React.ReactNode;
}

export default async function SellerLayout({children}: DashboardType) {
    const user = await currentUser();
    const userId = user?.id;

    if (!userId) {
        redirect('/auth/Login')
    }

    const store = await db?.stores?.findFirst({
        where: {
            UserId: userId
        }
    })

    if (store) {
        redirect(`/seller/${store.Id}`);
    }

    return (
        <>
            {/* <Navbar /> */}
            {children}
        </>
    )
}
