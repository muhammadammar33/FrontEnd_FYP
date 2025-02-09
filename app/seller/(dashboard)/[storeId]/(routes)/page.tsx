import { CardWrapper } from "@/components/auth/card-wrapper";
import { db } from "@/lib/db";

interface DashboardFaceProps {
    params: { storeId: string };
}

const StorePage:React.FC<DashboardFaceProps> = async ({
    params
}) => {
    const store = await db.stores.findFirst({
        where: {
            Id: params.storeId
        }
    })
    return (
        <>
            Active Store : {store?.Name}
            {/* <CardWrapper 
                headerLabel="Sellers"
                backButtonLabel="Stores"
                backButtonHref="/seller/stores"
                guestButtonHref="/seller/products"
                guestButtonLabel="Products"
                showSocial={false}
            >
                <h1>Welcome to Store</h1>
            </CardWrapper> */}
        </>
    );
};

export default StorePage;