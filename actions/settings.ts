"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserbyEmail, getUserbyId } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { currentRole } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

// Define schema as a regular variable, not as an export
const SellerSettingsSchema = z.object({
    name: z.string().optional(),
});

export async function sellerSettings(values: z.infer<typeof SellerSettingsSchema>) {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const role = await currentRole();

    if (role !== "SELLER") {
        return { error: "Unauthorized - Seller role required" };
    }

    const dbUser = await getUserbyId(user.id);

    if (!dbUser) {
        return { error: "User not found" };
    }

    // Update the user in the database
    const updatedUser = await db.user.update({
        where: { id: dbUser.id },
        data: {
        ...values,
        }
    });

    return { success: "Settings updated!" };
}

export async function settings(values: z.infer<typeof SettingsSchema>) {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const Role = await currentRole();

    if (Role === "SELLER") {
        const { name } = values;
        
        const updatedUser = await db.user.update({
        where: { id: user.id },
        data: { name }
        });
        
        return { success: "Profile updated!" };
    }

    if (Role !== "BUYER") {
        return { error: "Unauthorized" }
    }

    const dbUser = await getUserbyId(user.id);

    if (!dbUser) {
        return { error: "Unauthorized" }
    }

    if (user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserbyEmail(values.email);

        if (existingUser && existingUser.id !== user.id) {
        return { error: "Email already in use!" }
        }

        const verificationToken = await generateVerificationToken(
        values.email
        );
        await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
        );

        return { success: "Verification email sent!" };
    }

    if (values.password && values.newPassword && dbUser.password) {
        const passwordsMatch = await bcrypt.compare(
            values.password,
            dbUser.password,
        );

        if (!passwordsMatch) {
            return { error: "Incorrect password!" };
        }

        const hashedPassword = await bcrypt.hash(
            values.newPassword,
            10,
        );
        values.password = hashedPassword;
        values.newPassword = undefined;
    }

    const updatedUser = await db.user.update({
        where: { id: dbUser.id },
        data: {
        ...values,
        }
    });

    // update({
    //     user: {
    //     name: updatedUser.name,
    //     email: updatedUser.email,
    //     isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
    //     role: updatedUser.role,
    //     }
    // });

    return { success: "Settings Updated!" }
}