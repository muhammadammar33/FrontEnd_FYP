"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

const SettingsPage = () => {
    const user = useCurrentUser();

    const onClick = () => {
        logout();
    }

    return (
        <div className="bg-white p-10 rounded-xl">
            <h1>Settings</h1>
            <h2>{user?.role}</h2>
            <p>{JSON.stringify(user)}</p>
                <button onClick={onClick} type="submit">SignOut</button>
        </div>
    );
}

export default SettingsPage;