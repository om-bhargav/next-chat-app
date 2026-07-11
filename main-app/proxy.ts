import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/panel(.*)"]);

const isPublicAuthRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Not logged in -> protect panel
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Logged in -> keep inside panel
  if (userId && isPublicAuthRoute(req)) {
    return NextResponse.redirect(new URL("/panel", req.url));
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
