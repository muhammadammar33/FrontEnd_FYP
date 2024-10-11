"use client";

import {FcGoogle} from "react-icons/fc";
import { Button } from "../ui/button";

export const Socail = () => {
    return (
        <div className="flex items-center justify-center w-full gap-x-2">
            <Button
                size="sm"
                className="W-full"
                variant="outline"
                onClick={() => {}}
            >
                <FcGoogle className="w-6 h-6"/>
            </Button>
        </div>
    )
}