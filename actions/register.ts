"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

import { RegisterSchema } from "@/schemas";
import { error } from "console";
import { getUserbyEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

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

    const verificationToken = await generateVerificationToken(email);
    console.log(verificationToken.email, verificationToken.token);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);


    return {success: "Confirmation email sent"};
}