import { UserRole } from "@prisma/client";
import * as z from "zod";

const phoneRegex = new RegExp(
    /^\+923\d{9}$/
);

const passRegex = new RegExp(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);


export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
    code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
    name: z.string().max(30).min(1, {
        message: "Enter Valid Name",
    }),
    phone: z.string().regex(phoneRegex,{
        message: "Enter Valid Phone Number",
    }),
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().regex(passRegex, {
        message: "Password is required atleast 8 characters long, 1 letter, 1 number and 1 special character",
    }),
    role: z.enum([UserRole.ADMIN, UserRole.BUYER, UserRole.SELLER], {
        message: "Role is required",
    }),
});

export const SettingsSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.BUYER, UserRole.SELLER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
})
    .refine((data) => {
        if (data.password && !data.newPassword) {
        return false;
        }

        return true;
    }, {
        message: "New password is required!",
        path: ["newPassword"]
    })
    .refine((data) => {
        if (data.newPassword && !data.password) {
        return false;
        }

        return true;
    }, {
        message: "Password is required!",
        path: ["password"]
    })

    export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum of 6 characters required",
    }),
});