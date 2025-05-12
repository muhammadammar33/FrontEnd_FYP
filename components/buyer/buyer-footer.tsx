import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function BuyerFooter() {
    return (
        <footer className="border-t bg-background">
        <div className="container px-4 py-12 md:py-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            <div className="lg:col-span-2">
                <Link href="/" className="inline-block font-bold text-xl mb-4">
                le&#39;Elysian
                </Link>
                <p className="text-muted-foreground mb-4 max-w-xs">
                Discover the latest fashion trends and shop high-quality clothing, accessories, and more.
                </p>
                <div className="flex space-x-4">
                <Button variant="ghost" size="icon" aria-label="Facebook">
                    <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Instagram">
                    <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Twitter">
                    <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="YouTube">
                    <Youtube className="h-5 w-5" />
                </Button>
                </div>
            </div>

            <div>
                <h3 className="font-medium mb-4">Shop</h3>
                <ul className="space-y-2">
                <li>
                    <Link href="/products" className="text-muted-foreground hover:text-foreground">
                    All Products
                    </Link>
                </li>
                <li>
                    <Link href="/products?category=clothing" className="text-muted-foreground hover:text-foreground">
                    Clothing
                    </Link>
                </li>
                <li>
                    <Link href="/products?category=accessories" className="text-muted-foreground hover:text-foreground">
                    Accessories
                    </Link>
                </li>
                <li>
                    <Link href="/products?category=footwear" className="text-muted-foreground hover:text-foreground">
                    Footwear
                    </Link>
                </li>
                <li>
                    <Link href="/products?sale=true" className="text-muted-foreground hover:text-foreground">
                    Sale
                    </Link>
                </li>
                </ul>
            </div>

            <div>
                <h3 className="font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                <li>
                    <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                    </Link>
                </li>
                <li>
                    <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                    Careers
                    </Link>
                </li>
                <li>
                    <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact Us
                    </Link>
                </li>
                <li>
                    <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                    Blog
                    </Link>
                </li>
                </ul>
            </div>

            <div>
                <h3 className="font-medium mb-4">Customer Service</h3>
                <ul className="space-y-2">
                <li>
                    <Link href="/help" className="text-muted-foreground hover:text-foreground">
                    Help Center
                    </Link>
                </li>
                <li>
                    <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                    Shipping & Delivery
                    </Link>
                </li>
                <li>
                    <Link href="/returns" className="text-muted-foreground hover:text-foreground">
                    Returns & Exchanges
                    </Link>
                </li>
                <li>
                    <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                    FAQ
                    </Link>
                </li>
                </ul>
            </div>
            </div>

            <div className="mt-12 border-t pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} le&#39;Elysian. All rights reserved.
                </p>
                <div className="mt-4 flex space-x-4 md:mt-0">
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                </Link>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms of Service
                </Link>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground">
                    Cookie Policy
                </Link>
                </div>
            </div>
            </div>
        </div>
        </footer>
    )
}
