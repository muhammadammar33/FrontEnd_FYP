import NextAuth, { Session } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import authConfig from "./auth.config"
import { db } from "./lib/db"
import { getUserbyId } from "./data/user"
import { getTwoFactorConfirmationByUserId } from "./data/twoFactorConfirmation"

const prisma = new PrismaClient()

export const { auth, handlers, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/auth/Login",
        signOut: "/auth/Login",
        error: "/auth/Error",
        verifyRequest: "/auth/verify-request",
        newUser: "/auth/new-user",
    },
    events: {
        async linkAccount({ user }){
            await db.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: new Date()
                }
            })
        }
    },
    callbacks: {
        async signIn({ user, account }){

            if (account?.provider !== "credentials") {
                return true;
            }

            if (!user.id) {
                return false;
            }

            const existingUser = await getUserbyId(user.id);

            if (!existingUser || !existingUser?.emailVerified) {
                return false;
            }

            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

                if (!twoFactorConfirmation) return false;

                // Delete two factor confirmation for next sign in
                await db.twoFactorConfirmation.delete({
                where: { id: twoFactorConfirmation.id }
                });
            }
            
            return true;
        },

        async session({ session, token }: { session: Session & { user: { id?: string, role?: "ADMIN" | "SELLER" | "BUYER" } }, token: any }){
            console.log("session", session, token);

            if(session.user && token.sub){
                session.user.id = token.sub;
            }

            if(session.user && token.role){
                session.user.role = token.role;
            }
            return session;
        },

        async jwt({token}){
            if (!token.sub) {
                return token;
            }
            const existingUser = await getUserbyId(token.sub);
            if (!existingUser) {
                return token;
            }
            token.role = existingUser.role;
            return token;
        }
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
});