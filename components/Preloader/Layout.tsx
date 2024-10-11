"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Preloader from './Preloader';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
        setLoading(false);
        router.push('/auth/Login'); // Redirect to login page
        }, 1000); // Simulate loading time

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <>
        <Preloader loading={loading} />
        {!loading && <main>{children}</main>}
        </>
    );
};

export default Layout;
