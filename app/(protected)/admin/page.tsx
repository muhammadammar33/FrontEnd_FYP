"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {

    return (
        <Card className="w-[600px] bg-gray-100">
        <CardHeader>
            <p className="text-2xl font-semibold text-center">
            🔑 Admin
            </p>
        </CardHeader>
        <CardContent className="space-y-4">
            <RoleGate allowedRole={UserRole.ADMIN}>
            <FormSuccess
                message="You are allowed to see this content!"
            />
            </RoleGate>

            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">
                Admin-only Server Action
            </p>
            </div>
        </CardContent>
        </Card>
    );
};

export default AdminPage;