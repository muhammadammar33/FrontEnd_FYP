"use client"

import type React from "react"

import { useState } from "react"
import * as z from "zod"
import type { Categories, Colors, Image, Products, Sizes } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Trash, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
import ImageUpload from "@/components/ui/image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductFormProps {
    initialData:
        | (Products & {
            Images: Image[]
        })
        | null
    Categories: Categories[]
    Colors: Colors[]
    Sizes: Sizes[]
}

const formSchema = z.object({
    Name: z.string().min(1),
    Images: z.object({ url: z.string() }).array(),
    Description: z.string().optional(),
    Stock: z.coerce.number().min(0),
    Price: z.coerce.number().min(1),
    CategoryId: z.string().min(1),
    ColorId: z.string().min(1),
    SizeId: z.string().min(1),
    IsFeatured: z.boolean().default(false).optional(),
    IsArchived: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, Categories, Colors, Sizes }) => {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [generatingImage, setGeneratingImage] = useState(false)
    const [generatingDescription, setGeneratingDescription] = useState(false)

    const title = initialData ? "Edit Product" : "Create Product"
    const description = initialData ? "Edit a product" : "Add a new Product"
    const toastMessage = initialData ? "Product updated." : "Product created."
    const action = initialData ? "Save changes" : "Create"

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
        ? {
            ...initialData,
            Images: initialData.Images.map((image) => ({ url: image.Url })),
            Price: Number.parseFloat(String(initialData?.Price)),
            }
        : {
            Name: "",
            Description: "",
            Stock: 0,
            Images: [],
            Price: 0,
            CategoryId: "",
            ColorId: "",
            SizeId: "",
            IsFeatured: false,
            IsArchived: false,
            },
    })

    const onSubmit = async (data: ProductFormValues) => {
        try {
        setLoading(true)
        if (initialData) {
            await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
        } else {
            await axios.post(`/api/${params.storeId}/products`, data)
        }
        router.refresh()
        window.location.assign(`/seller/${params.storeId}?tab=products`)
        toast.success(toastMessage)
        } catch (err) {
        toast.error("Something went wrong.")
        } finally {
        setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
        setLoading(true)
        await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
        router.refresh()
        router.push(`/seller/${params.storeId}`)
        toast.success("Product deleted.")
        } catch (err) {
        toast.error("Something went wrong.")
        } finally {
        setLoading(false)
        setOpen(false)
        }
    }

    const generateDescription = async () => {
        const name = form.getValues("Name")
        if (!name) {
        toast.error("Please enter a product name to generate a description.")
        return
        }

        setGeneratingDescription(true)
        try {
        const response = await axios.post(
            `/api/${params.storeId}/products/description/generate`,
            { Name: name },
            { headers: { "Content-Type": "application/json" } },
        )

        form.setValue("Description", response.data.generatedDescription)
        toast.success("Description generated successfully.")
        } catch (err) {
        toast.error("Failed to generate description.")
        } finally {
        setGeneratingDescription(false)
        }
    }

    const generateImage = async () => {
        const description = form.getValues("Description")
        if (!description) {
        toast.error("Please enter a description to generate an image.")
        return
        }

        setGeneratingImage(true)
        try {
        const response = await axios.post(
            `/api/${params.storeId}/products/image/generate`,
            { Description: description },
            { headers: { "Content-Type": "application/json" } },
        )

        const imageUrl = response.data.imageUrl
        form.setValue("Images", [...form.getValues("Images"), { url: imageUrl }])
        toast.success("Image generated and uploaded successfully.")
        } catch (err) {
        console.error("Error generating or uploading image:", err)
        toast.error("Failed to generate image.")
        } finally {
        setGeneratingImage(false)
        }
    }

    return (
        <>
        <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
        <div className="space-y-4">
            <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                <p className="text-muted-foreground">{description}</p>
            </div>
            {initialData && (
                <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={loading}>
                <Trash className="w-4 h-4 mr-2" />
                Delete
                </Button>
            )}
            </div>
            <Separator />
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                    <CardDescription>Basic details about your product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                    control={form.control}
                    name="Name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name</FormLabel>
                        <div className="flex gap-2">
                            <FormControl>
                            <Input disabled={loading} placeholder="Product Name" {...field} />
                            </FormControl>
                            <Button
                            type="button"
                            variant="outline"
                            onClick={generateDescription}
                            disabled={generatingDescription || loading}
                            >
                            {generatingDescription ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                                </>
                            ) : (
                                "Generate Description"
                            )}
                            </Button>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="Description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description</FormLabel>
                        <div className="flex gap-2">
                            <FormControl>
                            <Input disabled={loading} placeholder="Product Description" {...field} />
                            </FormControl>
                            <Button
                            type="button"
                            variant="outline"
                            onClick={generateImage}
                            disabled={generatingImage || loading}
                            >
                            {generatingImage ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                                </>
                            ) : (
                                "Generate Image"
                            )}
                            </Button>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="Images"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Product Images</FormLabel>
                        <FormControl>
                            <ImageUpload
                            value={field.value.map((image: { url: string }) => image.url)}
                            disabled={loading}
                            onChange={(url) => field.onChange([...field.value, { url }])}
                            onRemove={(url) => field.onChange([...field.value.filter((image) => image.url !== url)])}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
                </Card>

                <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Inventory and pricing information</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormField
                        control={form.control}
                        name="Stock"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stock</FormLabel>
                            <FormControl>
                            <Input type="number" disabled={loading} placeholder="Product Stock" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="Price"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                            <Input type="number" disabled={loading} placeholder="Product Price" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="CategoryId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                            >
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue defaultValue={field.value} placeholder="Select a Category" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Categories.map((category) => (
                                <SelectItem key={category.Id} value={category.Id}>
                                    {category.Name}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="SizeId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Size</FormLabel>
                            <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                            >
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue defaultValue={field.value} placeholder="Select a size" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Sizes.map((size) => (
                                <SelectItem key={size.Id} value={size.Id}>
                                    {size.Name}
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ColorId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Color</FormLabel>
                            <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                            >
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue defaultValue={field.value} placeholder="Select a color" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Colors.map((color) => (
                                <SelectItem key={color.Id} value={color.Id}>
                                    <div className="flex items-center">
                                    <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: color.Value }} />
                                    <span>{color.Name}</span>
                                    </div>
                                </SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                </CardContent>
                </Card>

                <Card>
                <CardHeader>
                    <CardTitle>Product Visibility</CardTitle>
                    <CardDescription>Control how your product appears in the store</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="IsFeatured"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel>Featured</FormLabel>
                            <FormDescription>The product will appear on the home page.</FormDescription>
                            </div>
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="IsArchived"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel>Archived</FormLabel>
                            <FormDescription>The product will not appear anywhere in the store.</FormDescription>
                            </div>
                        </FormItem>
                        )}
                    />
                    </div>
                </CardContent>
                </Card>

                <div className="flex justify-end">
                <Button disabled={loading} type="submit" className="w-full md:w-auto">
                    {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {action}...
                    </>
                    ) : (
                    action
                    )}
                </Button>
                </div>
            </form>
            </Form>
        </div>
        </>
    )
}