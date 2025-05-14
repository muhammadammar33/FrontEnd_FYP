"use client";
import { useSession } from 'next-auth/react';

export default function Sasti() {
    // State
    const { data: session } = useSession();
    const user = session?.user;
    console.log(user);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Welcome to Sasti</h1>
            <p className="mt-4 text-lg">Your session data:</p>
            <pre className="mt-2 bg-gray-100 p-4 rounded-md">
                {JSON.stringify(user, null, 2)}
            </pre>
        </div>
    );
}
