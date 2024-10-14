import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "../ui/button";
import Link from "next/link";

export const ErrorCard = () => {
    return (
        <CardWrapper
        headerLabel="Oops! Something went wrong!"
        backButtonHref=""
        backButtonLabel=""
        guestButtonHref=""
        guestButtonLabel=""
        showSocial={false}
        >
            <div className="w-full flex justify-center items-center">
                <ExclamationTriangleIcon className="text-destructive" />
            </div>
            <div className="flex items-center justify-center">
                <Button
                    size="sm"
                    variant="link"
                    asChild
                    className="px-0 font-normal text-sky-300"
                >
                    <Link href="/auth/Login">
                        Back to Login
                    </Link>
                </Button>
            </div>
        </CardWrapper>
    );
};