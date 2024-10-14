"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { NewPasswordSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,  
} from "@/components/ui/form";
import { CardWrapper } from "@/components/auth/card-wrapper"
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-errors/form-error";
import { FormSuccess } from "@/components/form-success/form-success";
import { newPassword } from "@/actions/new-password";
import Link from "next/link";

export const NewPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
        password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
        newPassword(values, token)
            .then((data) => {
            setError(data?.error);
            setSuccess(data?.success);
            });
        });
    };

    return (
        <CardWrapper
        headerLabel="Enter a new password"
        >
        <Form {...form}>
            <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            >
            <div className="space-y-4">
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
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
                disabled={isPending}
                type="submit"
                className="w-full py-2 text-gray-800 bg-sky-300 rounded-md hover:bg-gray-800 hover:text-sky-300"
            >
                Reset password
            </Button>
            <div className="flex items-center justify-center">
                <Button
                    size="sm"
                    variant="link"
                    asChild
                    className="px-0 font-normal text-sky-300"
                >
                    <Link href="/auth/Login">
                        Back to Login
                    </Link>
                </Button>
            </div>
            </form>
        </Form>
        </CardWrapper>
    );
};