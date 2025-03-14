"use client"

import { useState } from 'react'
import * as z from 'zod'
import { Categories, Colors, Image, Products, Sizes } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import ImageUpload from '@/components/ui/image-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductFromProps {
    initialData: Products & {
        Images: Image[]
    } | null;
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
    IsArchived: z.boolean().default(false).optional()
    
})

type ProductFormValues = z.infer<typeof formSchema>;

export const ProductForm: React.FC<ProductFromProps> = ({
    initialData,
    Categories,
    Colors,
    Sizes
}) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generatingImage, setGeneratingImage] = useState(false);
    const [generatingDescription, setGeneratingDescription] = useState(false);

    const title = initialData ? 'Edit Product' : 'Create Product'
    const description = initialData ? 'Edit a product' : 'Add a new Product'
    const toastMessage = initialData ? 'Product updated.' : 'Product created.'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            Images: initialData.Images.map(image => ({ url: image.Url })),
            Price: parseFloat(String(initialData?.Price))
        } : {
            Name: '',
            Description: '',
            Stock: 0,
            Images: [],
            Price: 0,
            CategoryId: '',
            ColorId: '',
            SizeId: '',
            IsFeatured: false,
            IsArchived: false,
        }
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            console.log(data);
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/products`, data)
            }
            router.refresh();
            router.push(`/seller/${params.storeId}/products`);
            toast.success(toastMessage)
        } catch(err) {
            toast.error("Something went wrong.");
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh();
            router.push(`/seller/${params.storeId}/products`)
            toast.success("Product deleted.")
        } catch(err) {
            toast.error("Something Went Wrong.");
        } finally {
            setLoading(false)
            setOpen(false);
        }
    }

    const generateDescription = async () => {
        const name = form.getValues('Name'); // Get the product name from the form
        if (!name) {
            toast.error('Please enter a product name to generate a description.');
            return;
        }

        setGeneratingDescription(true); // Set loading state for description generation
        try {
            const response = await axios.post(
                `/api/${params.storeId}/products/description/generate`, // API route for description generation
                { Name: name }, // Pass the product name to the API
                { headers: { 'Content-Type': 'application/json' } }
            );

            // Update the Description field in the form with the generated description
            form.setValue('Description', response.data.generatedDescription);
            toast.success('Description generated successfully.');
        } catch (err) {
            toast.error('Failed to generate description.');
        } finally {
            setGeneratingDescription(false); // Reset loading state
        }
    };

    const generateImage = async () => {
        const description = form.getValues('Description');
        if (!description) {
            toast.error('Please enter a description to generate an image.');
            return;
        }

        setGeneratingImage(true);
        try {
            // Call the updated API route
            const response = await axios.post(
                `/api/${params.storeId}/products/image/generate`,
                { Description: description },
                { headers: { 'Content-Type': 'application/json' } }
            );

            // Get the Cloudinary URL from the response
            const imageUrl = response.data.imageUrl;

            // Update the Images field in the form
            form.setValue('Images', [...form.getValues('Images'), { url: imageUrl }]);
            toast.success('Image generated and uploaded successfully.');
        } catch (err) {
            console.error('Error generating or uploading image:', err);
            toast.error('Failed to generate image.');
        } finally {
            setGeneratingImage(false);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={loading}>
                        <Trash className="w-4 h-4" />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    {/* <FormField
                        control={form.control} 
                        name="Name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Product Name' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}
                    {/* <FormField
                        control={form.control} 
                        name="Description"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder='Product Description' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}
                    <FormField
                        control={form.control}
                        name="Name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <div className="flex gap-2">
                                        <Input disabled={loading} className='bg-white' placeholder="Product Name" {...field} />
                                        <Button
                                            type="button"
                                            onClick={generateDescription}
                                            disabled={generatingDescription || loading}
                                        >
                                            {generatingDescription ? 'Generating...' : 'Generate Description'}
                                        </Button>
                                    </div>
                                </FormControl>
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
                                <FormControl>
                                    <div className="flex gap-2">
                                        <Input disabled={loading} className='bg-white' placeholder="Product Description" {...field} />
                                        <Button
                                            type="button"
                                            onClick={generateImage}
                                            disabled={generatingImage || loading}
                                        >
                                            {generatingImage ? 'Generating...' : 'Generate Image'}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control} 
                        name="Images"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Background Image</FormLabel>
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
                    {/* <FormField
                        control={form.control}
                        name="Images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Generated Image</FormLabel>
                                <FormControl>
                                    <div className="flex flex-col gap-4">
                                        {field.value.length > 0 && (
                                            <img
                                                src={field.value[0].url}
                                                alt="Generated Product"
                                                className="w-64 h-64 object-cover rounded-lg"
                                            />
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control} 
                            name="Stock"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} className='bg-white' placeholder='Product Stock' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="Price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} className='bg-white' placeholder='Product Price' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="CategoryId"
                            render={({field}) => (
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
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder='Select a Category'
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Categories.map(category => (
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
                            render={({field}) => (
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
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder='Select a size'
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Sizes.map(size => (
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
                            render={({field}) => (
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
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder='Select a color'
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Colors.map(color => (
                                                <SelectItem style={{ display: 'flex' }} key={color.Id} value={color.Id}>
                                                    <span style={{ color: color.Value }}>{color.Name}</span>
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
                            name="IsFeatured"
                            render={({field}) => (
                                <FormItem className='flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md'>
                                    <FormControl>
                                        <Checkbox
                                            // @ts-ignore
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>
                                            Featured
                                        </FormLabel>
                                        <FormDescription>
                                            The product will appear on the home page.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control} 
                            name="IsArchived"
                            render={({field}) => (
                                <FormItem className='flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md'>
                                    <FormControl>
                                        <Checkbox
                                            // @ts-ignore
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>
                                            Archived
                                        </FormLabel>
                                        <FormDescription>
                                            The product will appear anywhere in the store.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
                </form>
            </Form>
            {/* <Separator /> */}
        </>
    )
}