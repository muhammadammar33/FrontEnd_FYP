import Container from "@/components/ui/container";
// import Billboard from "../components/billboard";
import { db } from "@/lib/db";
import StoreList from "../../_components/store-list";
import { formatter } from '@/lib/utils'
import { Billboard, Stores } from "@/types";


const HomePage = async () => {
    const stores = (await db.stores.findMany({
        where: {
            Status: "PENDING",
        },
    })).map(store => ({
        id: store.Id,
        name: store.Name,
        description: store.Description,
        status: store.Status,
        imageUrl: store.ImageUrl || "", // Add the required imageUrl property
        createdAt: store.CreatedAt,
        updatedAt: store.UpdatedAt,
        userId: store.UserId,
        reason: store.Reason,
    }));

    return (
        <Container>
            <div className="pb-10 space-y-10">
                {/* {billboards.map(billboard => (
                    <Billboard key={billboard.id} data={billboard} />
                ))} */}

                <div className="flex flex-col px-4 gap-y-8 sm:px-6 lg:px-8">
                    <StoreList title="Pending Stores" items={stores} />
                </div>
            </div>
        </Container>
    )
}

export default HomePage;