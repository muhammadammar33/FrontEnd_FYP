"use client";

import { useCallback, useEffect, useState } from "react";
import { HashLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { newVerification } from "@/actions/new-verification";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-errors/form-error";
import { FormSuccess } from "@/components/form-success/form-success";
import { Button } from "../ui/button";
import Link from "next/link";

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");
    console.log("before:", token);

    const onSubmit = useCallback(() => {
        console.log("after:", token);
        if (success || error) return;

        if (!token) {
            setError("Missing token!");
            return;
        }

        newVerification(token)
        .then((data) => {
            setSuccess(data.success);
            setError(data.error);
        })
        .catch(() => {
            setError("Something went wrong!");
        })
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    });

    return (
        <CardWrapper
        headerLabel="Confirming your verification"
        >
        <div className="flex items-center w-full justify-center">
            {!success && !error && (
                <HashLoader color="#7dd3fc"/>
            )}
                <FormSuccess message={success} />
            {!success && (
                <FormError message={error} />
            )}
        </div>
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
        </CardWrapper>
    )
}