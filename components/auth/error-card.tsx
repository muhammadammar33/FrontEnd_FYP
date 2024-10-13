import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { CardWrapper } from "@/components/auth/card-wrapper";

export const ErrorCard = () => {
    return (
        <CardWrapper
        headerLabel="Oops! Something went wrong!"
        backButtonHref="/auth/Login"
        backButtonLabel="Back to Login Page"
        pageLabel="Error"
        guestButtonHref=""
        guestButtonLabel=""
        showSocial={false}
        >
            <div className="w-full flex justify-center items-center">
                <ExclamationTriangleIcon className="text-destructive" />
            </div>
        </CardWrapper>
    );
};