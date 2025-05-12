import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-md">
            <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
            <h1 className="mt-6 text-2xl font-bold">Order Confirmed!</h1>
            <p className="mt-2 text-muted-foreground">
            Thank you for your purchase. We&#39;ve sent a confirmation email with your order details.
            </p>

            <div className="mt-8 rounded-lg border p-6 text-left">
            <h2 className="text-lg font-medium mb-4">Order #12345</h2>
            <div className="space-y-2">
                <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span>$129.99</span>
                </div>
                <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span>Credit Card</span>
                </div>
            </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
                <Link href="/products">Continue Shopping</Link>
            </Button>
            <Button variant="outline" asChild>
                <Link href="/account/orders">View Order</Link>
            </Button>
            </div>
        </div>
        </div>
    )
}
