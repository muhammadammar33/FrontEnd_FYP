import * as z from "zod";

const phoneRegex = new RegExp(
    /^\+923\d{9}$/
);

const passRegex = new RegExp(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
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
});