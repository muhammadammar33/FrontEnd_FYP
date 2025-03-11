"use client";

// import { logout } from "@/actions/logout";
import { signOut } from "@/auth";

interface LogoutButtonProps {
    children?: React.ReactNode;
};

export const LogoutButton = ({
    children
}: LogoutButtonProps) => {
    const onClick = () => {
        signOut({ redirectTo: "/auth/Login" })
        window.location.reload();
    };

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    );
};