// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;
//   const url = req.nextUrl.clone();

//   // If no token found, redirect to signin
//   if (!token) {
//     url.pathname = "/auth/signin";
//     return NextResponse.redirect(url);
//   }

//   const secret = process.env.JWT_SECRET;
//   if (!secret) {
//     throw new Error("JWT_SECRET is not defined in environment variables");
//   }

//   try {
//     jwt.verify(token, secret); // ✅ Now both are definitely strings
//     return NextResponse.next();
//   } catch (err) {
//     console.error("JWT verification failed:", err);
//     url.pathname = "/auth/signin";
//     return NextResponse.redirect(url);
//   }
// }

// export const config = {
//   matcher: ["/dashboard/:path*"], // Protect all dashboard routes
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  try {
    // Verify JWT (Edge-compatible)
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
}

// Protect routes starting with /dashboard
export const config = {
  matcher: ["/dashboard/:path*"],
};
