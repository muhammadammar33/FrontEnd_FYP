import { ThemeProvider } from '@/providers/theme-provider'
import Navbar from './_components/navbar'

export const metadata = {
    title: 'Seller Dashboard',
    description: 'Seller Dashboard',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className='bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900 to-blue-900'>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                {/* <Navbar /> */}
                    {children}
            </ThemeProvider>
            </body>
        </html>
    )
}