import Container from "@/components/ui/container";
import Link from "next/link";
import MainNav from "./main-nav";
import NavbarActions from "./navbar-actions";
import { useParams } from "next/navigation";
import { db } from "@/lib/db";
import { Billboard } from "@/types";
import { Button } from "@/components/ui/button";

export const revalidate = 0;
interface NavbarProps {
    storeId: string;
}

const Navbar = async ({ storeId }: NavbarProps) => {

    const Store = await db.stores.findFirst({
        where: {
            Id : storeId,
        }
    });
    const dbCategories = await db.categories.findMany({
        where: {
            StoreId: Array.isArray(storeId) ? storeId[0] : storeId,
        }
    });

    const store = Store ? [{
        name: Store.Name,
    }] : [];

    const categories = dbCategories.map(category => ({
        id: category.Id,
        name: category.Name,
        createdAt: category.CreatedAt,
        updatedAt: category.UpdatedAt,
        storeId: category.StoreId
    }));

    return (
        <div className="border-b">
            <Container>
                <div className="relative flex items-center h-16 px-4 sm:px-6 lg:px-8">
                    <Link href={`/store/${storeId}`} className="flex ml-4 lg:ml-0 gap-x-2">
                        <p className="text-xl font-bold">{store[0]?.name}</p>
                    </Link>
                    <MainNav data={categories} storeId={storeId} />
                    <NavbarActions storeId={storeId} />
                </div>
            </Container>
        </div>
    )
}
export default Navbar;