// // import { NextResponse } from "next/server";
// // import type { NextRequest } from "next/server";
// // import { jwtVerify } from "jose";

// // export async function middleware(req: NextRequest) {
// //   const token = req.cookies.get("token")?.value;
// //   const secret = process.env.JWT_SECRET;

// //   if (!token || !secret) {
// //     return NextResponse.redirect(new URL("/auth/signin", req.url));
// //   }



// //   try {
// //     // Verify JWT (Edge-compatible)
// //     await jwtVerify(token, new TextEncoder().encode(secret));
// //     return NextResponse.next();
// //   } catch (err) {
// //     console.error("JWT verification failed:", err);
// //     return NextResponse.redirect(new URL("/auth/signin", req.url));
// //   }
// // }

// // // Protect routes starting with /dashboard
// // export const config = {
// //   matcher: ["/dashboard/:path*"],
// // };


// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// export async function middleware(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;
//   const secret = process.env.JWT_SECRET;

//   // ✅ Case 1: When visiting home page "/"
//   if (req.nextUrl.pathname === "/") {
//     if (token && secret) {
//       try {
//         await jwtVerify(token, new TextEncoder().encode(secret));
//         // Token exists and valid → redirect to signin
//         return NextResponse.redirect(new URL("/auth/signin", req.url));
//       } catch (err) {
//         console.error("JWT verification failed:", err);
//         // Invalid token → redirect to signup
//         return NextResponse.redirect(new URL("/auth/signup", req.url));
//       }
//     } else {
//       // No token → redirect to signup
//       return NextResponse.redirect(new URL("/auth/signup", req.url));
//     }
//   }

//   // ✅ Case 2: When visiting protected routes like /dashboard/*
//   if (req.nextUrl.pathname.startsWith("/dashboard")) {
//     if (!token || !secret) {
//       // No token → redirect to signin
//       return NextResponse.redirect(new URL("/auth/signin", req.url));
//     }

//     try {
//       await jwtVerify(token, new TextEncoder().encode(secret));
//       // Token valid → allow access
//       return NextResponse.next();
//     } catch (err) {
//       console.error("JWT verification failed:", err);
//       // Invalid token → redirect to signin
//       return NextResponse.redirect(new URL("/auth/signin", req.url));
//     }
//   }

//   // ✅ Allow all other routes
//   return NextResponse.next();
// }

// // ✅ Apply middleware to home page and dashboard routes
// export const config = {
//   matcher: ["/", "/dashboard/:path*", "/api/auth/upload/:path*"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const secret = process.env.JWT_SECRET;

  // 🚫 If secret is missing, log warning
  if (!secret) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const { pathname } = req.nextUrl;

  // ✅ 1️⃣ Handle Home Page "/"
  if (pathname === "/") {
    if (!token) {
      // No token → redirect to signup
      return NextResponse.redirect(new URL("/auth/signup", req.url));
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      // Token valid → redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } catch (err) {
      console.error("JWT verification failed:", err);
      // Invalid token → redirect to signup
      return NextResponse.redirect(new URL("/auth/signup", req.url));
    }
  }

  // ✅ 2️⃣ Protect Dashboard Pages "/dashboard/*"
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    try {
      await jwtVerify(token, new TextEncoder().encode(secret));
      return NextResponse.next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }


  // if (pathname.startsWith("/api/auth/")) {
  //   if (!token) {
  //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //   }

  //   try {
  //     await jwtVerify(token, new TextEncoder().encode(secret));
  //     return NextResponse.next(); // token valid → allow upload
  //   } catch (err) {
  //     console.error("JWT verification failed:", err);
  //     return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
  //   }
  // }

  // ✅ Allow all other routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/api/auth/:path*"],
};



