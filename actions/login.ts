"use server";

import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { error } from "console";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/token";
import { getUserbyEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validateFields = LoginSchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "Invalid fields"};
    }

    const { email, password } = validateFields.data;

    const existingUser = await getUserbyEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return {error: "Email does not exist"};
    }
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        return {success: "Confirmation email sent"};
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {error: "Invalid credentials"};
                default:
                    return {error: "An unknown error occurred"};
            }
        }
        throw error;
    }
}