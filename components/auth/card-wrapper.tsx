"use client";

import exp from "constants";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel?: string;
    backButtonLabel?: string;
    backButtonHref?: string;
    guestButtonLabel?: string;
    guestButtonHref?: string;
    showSocial?: boolean;
};

export const CardWrapper = ({ 
    children,
    headerLabel, 
    backButtonLabel,
    backButtonHref,
    guestButtonLabel,
    guestButtonHref,
    showSocial 
}: CardWrapperProps) => {
    return (
        <Card className="w-[600px] shadow-md m-5 p-2 bg-gray-800 border-gray-700">
            <CardHeader>
                <Header label={headerLabel}/>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Social/>
                </CardFooter>
            )}
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHref}/>
                <BackButton label={guestButtonLabel} href={guestButtonHref}/>
            </CardFooter>
        </Card>
    );
}