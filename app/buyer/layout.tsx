import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import BuyerNavbar from "@/components/buyer/buyer-navbar"
import BuyerFooter from "@/components/buyer/buyer-footer"
import { ThemeProvider } from "@/providers/theme-provider"
import { CartProvider } from "@/components/buyer/cart-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "le'Elysian | Shop the Latest Trends",
    description: "Discover the latest fashion trends and shop high-quality clothing, accessories, and more.",
}

export default function BuyerLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
            <ThemeProvider attribute="class" defaultTheme="light">
            <CartProvider>
                <div className="flex flex-col min-h-screen">
                <BuyerNavbar />
                <main className="flex-1">{children}</main>
                <BuyerFooter />
                </div>
            </CartProvider>
            </ThemeProvider>
        </body>
        </html>
    )
}
