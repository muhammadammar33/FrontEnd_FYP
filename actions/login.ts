"use server";

import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { error } from "console";
import { signIn } from "@/auth";
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { SellerRoute, AdminRoute, BuyerRoute } from "@/routes";
import { AuthError } from "next-auth";
import { getUserbyEmail } from "@/data/user";
import { 
    sendVerificationEmail,
    sendTwoFactorTokenEmail,
} from "@/lib/mail";
import { 
    generateVerificationToken,
    generateTwoFactorToken
} from "@/lib/token";
import { getTwoFactorTokenByEmail } from "@/data/twoFactorToken";
import { getTwoFactorConfirmationByUserId } from "@/data/twoFactorConfirmation";
import { db } from "@/lib/db";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validateFields = LoginSchema.safeParse(values);

    if (!validateFields.success) {
        return {error: "Invalid fields"};
    }

    const { email, password, code } = validateFields.data;

    const existingUser = await getUserbyEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return {error: "User with this email does not exist"};
    }
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        return {success: "Confirmation email sent"};
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        if (code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
        );

        if (!twoFactorToken) {
            return { error: "Invalid code!" };
        }

        if (twoFactorToken.token !== code) {
            return { error: "Invalid code!" };
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date();

        if (hasExpired) {
            return { error: "Code expired!" };
        }

        await db.twoFactorToken.delete({
            where: { id: twoFactorToken.id }
        });

        const existingConfirmation = await getTwoFactorConfirmationByUserId(
            existingUser.id
        );

        if (existingConfirmation) {
            await db.twoFactorConfirmation.delete({
            where: { id: existingConfirmation.id }
            });
        }

        await db.twoFactorConfirmation.create({
            data: {
            userId: existingUser.id,
            }
        });
        } else {
        const twoFactorToken = await generateTwoFactorToken(existingUser.email)
        await sendTwoFactorTokenEmail(
            twoFactorToken.email,
            twoFactorToken.token,
        );

        return { twoFactor: true };
        }
    }

    if (existingUser.role === "BUYER") {
        try {
            await signIn("credentials", {
                email,
                password,
                redirectTo: BuyerRoute
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
    } else if (existingUser.role === "SELLER") {
        try {
            await signIn("credentials", {
                email,
                password,
                redirectTo: SellerRoute
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
    } else if (existingUser.role === "ADMIN") {
        try {
            await signIn("credentials", {
                email,
                password,
                redirectTo: AdminRoute
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
    } else {
        return {error: "Invalid role"};
    }
}