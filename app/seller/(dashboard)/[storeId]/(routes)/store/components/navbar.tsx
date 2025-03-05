import Container from "@/components/ui/container";
import Link from "next/link";
import MainNav from "./main-nav";
// import getCategories from "@/actions/get-categories";
import NavbarActions from "./navbar-actions";
import { useParams } from "next/navigation";
import { db } from "@/lib/db";
import { Billboard } from "@/types";

export const revalidate = 0;

const Navbar = async () => {

    const params = useParams();
    const { storeId } = await params;
        const dbCategories = await db.categories.findMany({
            where: {
                StoreId: Array.isArray(storeId) ? storeId[0] : storeId,
            }
        });

        const categories = dbCategories.map(category => ({
            id: category.Id,
            name: category.Name,
            billboard: { id: category.BillBoardId } as Billboard,
            createdAt: category.CreatedAt,
            updatedAt: category.UpdatedAt,
            storeId: category.StoreId
        }));
    // const categories = await getCategories();

    return (
        <div className="border-b">
            <Container>
                <div className="relative flex items-center h-16 px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex ml-4 lg:ml-0 gap-x-2">
                        <p className="text-xl font-bold">STORE</p>
                    </Link>
                    <MainNav data={categories} />
                    <NavbarActions />
                </div>
            </Container>
        </div>
    )
}
export default Navbar;