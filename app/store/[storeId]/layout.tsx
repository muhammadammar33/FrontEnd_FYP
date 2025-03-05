// "use client"

import Footer from './components/footer'
import Navbar from './components/navbar'
// import './globals.css'
import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import ModalProvider from '@/providers/modal-provider'
import ToastProvider from '@/providers/toast-provider'

const urban = Urbanist({ subsets: ['latin'] })

// export const metadata: Metadata = {
//     title: 'Store',
//     description: 'Store',
// }

export default function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { storeId: string };
}) {
    return (
        <html lang="en">
            <body className={urban.className}>
                <ModalProvider />
                <ToastProvider />
                <Navbar storeId={params.storeId} />
                {children}
                <Footer />
            </body>
        </html>
    )
}