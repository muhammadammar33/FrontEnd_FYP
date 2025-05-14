"use client"

import { useState } from 'react'
import * as z from 'zod'
import { Categories } from "@prisma/client";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash, ArrowLeft } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import Link from "next/link"

interface SettingsFromProps {
    initialData: Categories | null;
}

const formSchema = z.object({
    Name: z.string().min(1),
})

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<SettingsFromProps> = ({ initialData }) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit category' : 'Create category'
    const description = initialData ? 'Edit a category' : 'Add a new category'
    const toastMessage = initialData ? 'Category updated.' : 'Category created.'
    const action = initialData ? 'Save changes' : 'Create'

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            Name: '',
        }
    });

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            console.log(data);
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/categories`, data)
            }
            router.refresh();
            router.push(`/seller/${params.storeId}/categories`);
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh();
            router.push(`/seller/${params.storeId}/categories`)
            toast.success("Category deleted.")
        } catch(err) {
            toast.error("Make sure you removed all products using this category first.");
        } finally {
            setLoading(false)
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
            isOpen={open}
            onClose={() => setOpen(false)}
            onConfirm={onDelete}
            loading={loading}
            />
            <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" asChild>
                    <Link href={`/seller/${params.storeId}?tab=categories`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Categories
                    </Link>
                </Button>
                
            </div>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={loading}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Category
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control} 
                            name="Name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Category name' {...field} />
                                    </FormControl>
                                    <FormMessage />
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