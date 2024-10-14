"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-errors/form-error";
import { FormSuccess } from "@/components/form-success/form-success";
import { register } from "@/actions/register";
import { useState } from "react";

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");

        register(values).
        then((data) => {
            setError(data.error);
            setSuccess(data.success);
        })
    }

    return (
        <CardWrapper
            headerLabel="Create an account!"
            backButtonLabel="Already have an account?"
            backButtonHref="/auth/Login"
            guestButtonLabel="Continue as guest"
            guestButtonHref="/Home"
            showSocial
        >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="space-y-4">
                        <div className="space-y-1">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sky-300">Name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="min 1, max 30 characters"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sky-300">Phone</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="+923xxxxxxxxx"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sky-300">Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="user@example.com"
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sky-300">Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            placeholder="********"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>

                        <FormError message={error}/>
                        <FormSuccess message={success}/>
                        <Button
                            type="submit"
                            className="w-full py-2 text-gray-800 bg-sky-300 rounded-md hover:bg-gray-800 hover:text-sky-300"
                        >
                            Register
                        </Button>
                    </div>
                </form>
            </Form>
        </CardWrapper>
    );
}