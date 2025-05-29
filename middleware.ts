import authConfig from "./auth.config"
import NextAuth from "next-auth"

import {apiAuthPrefix, authRoutes, publicRoutes } from "./routes"

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
    const { nextUrl } = req;
    const isLoggedIn = !req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        return;
    }

    // if (isAuthRoute) {
    //     if (isLoggedIn && nextUrl.pathname !== DEFAULT_LOGIN_REDIRECT) {
    //         return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    //     }
    //     return null;
    // }
    
    // if (isAuthRoute) {
    //     if (isLoggedIn && nextUrl.pathname !== DEFAULT_LOGIN_REDIRECT) {
    //         return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    //     }
    //     return null;
    // }

    if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
        return Response.redirect(new URL("/auth/Login", nextUrl));
    }

    return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: [],
};