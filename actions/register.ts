"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

import { RegisterSchema } from "@/schemas";
import { error } from "console";
import { getUserbyEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "Invalid fields"};
    }

    const { name, phone, email, password } = validateFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingEmail = await getUserbyEmail(email);
    
    if (existingEmail) {
        return {error: "Email already in use"};
    }
    
    const existingPhone = await getUserbyEmail(phone);

    if (existingPhone) {
        return {error: "Phone already in use"};
    }

    await db.user.create({
        data: {
            name,
            phone,
            email,
            password: hashedPassword,
        },
    });

    //TODO: send email verification

    return {success: "User created"};
}