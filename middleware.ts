// import { betterFetch } from "@better-fetch/fetch";
// import { NextResponse, type NextRequest } from "next/server";
// import type { Session } from "@/auth";

// const publicRoutes = ["/"];
// const authRoutes = ["/sign-in", "/sign-up"];
// const passwordRoutes = ["/reset-password", "/forgot-password"];
// const adminRoutes = ["/admin", "/admin/dashboard"];

// export default async function authMiddleware(request: NextRequest) {
//   const pathName = request.nextUrl.pathname;

//   const isPublicRoute = publicRoutes.includes(pathName);
//   const isAuthRoute = authRoutes.includes(pathName);
//   const isPasswordRoute = passwordRoutes.includes(pathName);
//   const isAdminRoute = adminRoutes.includes(pathName);

//   const { data: session } = await betterFetch<Session>(
//     "/api/auth/get-session",
//     {
//       baseURL: process.env.BETTER_AUTH_URL,
//       headers: {
//         cookie: request.headers.get("cookie") || "",
//       },
//     }
//   );

//   // const isAdminApiRoute =
//   //   pathName.startsWith("/api/banners") ||
//   //   pathName.startsWith("/api/services") ||
//   //   pathName.startsWith("/api/categories");
//   // if (isAdminApiRoute && session?.user?.role !== "admin") {
//   //   return new NextResponse("Forbidden", { status: 403 });
//   // }

//   // 🔒 Користувач неавторизований
//   if (!session) {
//     if (isPublicRoute || isAuthRoute || isPasswordRoute) {
//       return NextResponse.next();
//     }
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   // 🔄 Користувач вже залогінений, але намагається зайти на сторінку входу або відновлення паролю
//   if (isAuthRoute || isPasswordRoute) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // 🚫 Недостатньо прав для адмін зони
//   if (isAdminRoute && session?.user?.role !== "admin") {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // ✅ Все інше дозволено
//   return NextResponse.next();
// }

// export const config = {
//   // matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
//   matcher: [
//     "/((?!_next/static|_next/image|.*\\.png$).*)",
//     // "/api/banners/:path*",
//     // "/api/services/:path*",
//     // "/api/categories/:path*",
//   ],
// };
//
import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "@/auth";

const publicRoutes = ["/"];
const authRoutes = ["/sign-in", "/sign-up"];
const passwordRoutes = ["/reset-password", "/forgot-password"];
const adminRoutes = ["/admin", "/admin/dashboard"];

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  const isPublicRoute = publicRoutes.includes(pathName);
  const isAuthRoute = authRoutes.includes(pathName);
  const isPasswordRoute = passwordRoutes.includes(pathName);
  const isAdminRoute = adminRoutes.includes(pathName);

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.BETTER_AUTH_URL,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  // 🔒 Користувач неавторизований
  if (!session) {
    if (isPublicRoute || isAuthRoute || isPasswordRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 🔄 Користувач вже залогінений, але намагається зайти на сторінку входу або відновлення паролю
  if (isAuthRoute || isPasswordRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🚫 Недостатньо прав для адмін зони
  if (isAdminRoute && session?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Все інше дозволено
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
