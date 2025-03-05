"use client";

import { signIn } from "next-auth/react";
import {FcGoogle} from "react-icons/fc";
import { Button } from "@/components/ui/button";
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
    const onClick = (provider: "google") => {
        signIn(provider);
    }

    return (
        <div className="flex items-center justify-center w-full gap-x-2">
            <Button
                size="sm"
                className="W-full"
                variant="outline"
                onClick={() => onClick("google")}
            >
                <FcGoogle className="w-6 h-6"/>
            </Button>
        </div>
    )
}