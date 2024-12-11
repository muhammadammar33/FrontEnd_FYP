"use client";

import * as z from "zod";
import { useState } from 'react';
import { Done } from "@/components/auth/done";
import { CardWrapper } from "@/components/auth/card-wrapper";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas";
import { FormError } from "@/components/form-errors/form-error";
import { FormSuccess } from "@/components/form-success/form-success";
import { register } from "@/actions/register";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const SelectRole = () => {

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            role: undefined,
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
            headerLabel="Select your role"
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
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sky-300">Role</FormLabel>
                                    <FormControl>
                                        <select 
                                            {...field}
                                            className="w-full px-3 py-2 text-gray-400 text-sm rounded-md border border-input bg-transparent focus:outline-none focus:border-sky-300"
                                        >
                                            <option value="SELLER">Seller</option>
                                            <option value="BUYER">Buyer</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        </div>

                        <FormError message={error}/>
                        <FormSuccess message={success}/>
                        <Done label={"Confirm Role"} href={DEFAULT_LOGIN_REDIRECT}/>
                    </div>
                </form>
            </Form>
        </CardWrapper>
        
    );
};

export default SelectRole;
