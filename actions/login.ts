"use server";

import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { error } from "console";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validateFields = LoginSchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "Invalid fields"};
    }

    return {success: "Login successful"};
}