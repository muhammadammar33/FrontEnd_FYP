"use client";

import { logout } from "@/actions/logout";

interface LogoutButtonProps {
    children?: React.ReactNode;
};

export const LogoutButton = ({
    children
}: LogoutButtonProps) => {
    const onClick = () => {
        logout();
        window.location.reload();
    };

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
};