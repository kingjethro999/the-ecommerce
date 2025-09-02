import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/",
  "/products",
  "/categories",
  "/d",
  "/deals",
  "/recently-viewed",
  "/api",
  "/store",
  "/cart",
  "/help",
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = publicRoutes.some((p) => pathname.startsWith(p));

  if (isPublic) return NextResponse.next();

  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) return NextResponse.next();

  return NextResponse.redirect(new URL("/sign-in", req.url));
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
