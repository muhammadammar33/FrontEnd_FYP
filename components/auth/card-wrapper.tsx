"use client";

import exp from "constants";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Header } from "./header";
import { Socail } from "./socail";
import { BackButton } from "./back-button";

interface CardWrapperProps {
    children: React.ReactNode;
    pageLabel: string;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    guestButtonLabel: string;
    guestButtonHref: string;
    showSocial: boolean;
};

export const CardWrapper = ({ 
    children,
    pageLabel,
    headerLabel, 
    backButtonLabel,
    backButtonHref,
    guestButtonLabel,
    guestButtonHref,
    showSocial 
}: CardWrapperProps) => {
    return (
        <Card className="w-[600px] shadow-md p-2">
            <CardHeader>
                <Header label={pageLabel} labeled={headerLabel}/>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Socail/>
                </CardFooter>
            )}
            <CardFooter>
                <BackButton label={backButtonLabel} href={backButtonHref}/>
                <BackButton label={guestButtonLabel} href={guestButtonHref}/>
            </CardFooter>
        </Card>
    );
}