import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Newsletter() {
    return (
        <section className="rounded-lg bg-muted/50 p-6 md:p-10">
        <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Subscribe to our newsletter</h2>
            <p className="mt-2 text-muted-foreground">
            Get the latest updates, exclusive offers, and fashion tips delivered to your inbox.
            </p>
            <div className="mt-6 flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Input type="email" placeholder="Enter your email" className="sm:min-w-[300px]" />
            <Button type="submit">Subscribe</Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
        </div>
        </section>
    )
}
