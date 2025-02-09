'use client';

import { CardWrapper } from "@/components/auth/card-wrapper";

const SellersPage = () => {
    return (
        <>
            <CardWrapper 
                headerLabel="Sellers"
                backButtonLabel="Stores"
                backButtonHref="/seller/stores"
                guestButtonHref="/seller/products"
                guestButtonLabel="Products"
                showSocial={false}
            >
                <h1>Welcome Seller</h1>
            </CardWrapper>
        </>
    );
};

export default SellersPage;