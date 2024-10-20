import NextAuth, { Session } from "next-auth"
import { UserRole } from "@prisma/client";
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

        // async session({ session, token }: { session: Session & { user: { id?: string, role?: "ADMIN" | "SELLER" | "BUYER" } }, token: any }){
        //     console.log("session", session, token);

        //     if(session.user && token.sub){
        //         session.user.id = token.sub;
        //     }

        //     if(session.user && token.role){
        //         session.user.role = token.role;
        //     }
            
        //     if(session.user && token.role){
        //         session.user.role = token.role;
        //     }
        //     return session;
        // },

        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }

            if (session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
            }

            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email ?? '';
                session.user.isOAuth = token.isOAuth as boolean;
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
            token.IsTwoFactorEnabled = existingUser.isTwoFactorEnabled;
            return token;
        }
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
});