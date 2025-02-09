"use client"

import * as z from 'zod'
import { Modal } from "@/components/ui/modal"
import { useShopModal } from '@/hooks/use-shop-modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast' 

const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional()
})


export const ShopModal = () => {

    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: ""
        }
    })
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            // throw new Error('x')

            const response = await axios.post('/api/shops', values);
            // window.location.assign(`/${response.data.id}`)

            console.log(response.data);
            toast.success("Shop created successfully")
        } catch (err) {
            toast.error(`Something went Wrong ${err}`);
        } finally {
            setLoading(false);
        }
    }

    const shopModal = useShopModal();
    return (
        <Modal
            title="Create Shop"
            description="Add a new shop to manage products and categories"
            isOpen={shopModal.isOpen}
            onClose={shopModal.onClose}
        >
            <div>
                <div className='py-2 pb-4 space-y-4'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder='E-commerce'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={loading}
                                                placeholder='Description'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex items-center justify-end w-full pt-6 space-x-2'>
                                <Button
                                    disabled={loading}
                                    variant="outline"
                                    onClick={shopModal.onClose}>Cancel</Button>
                                <Button disabled={loading} type='submit' >Continue</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}