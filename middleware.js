import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const url = req.nextUrl;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (url.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
