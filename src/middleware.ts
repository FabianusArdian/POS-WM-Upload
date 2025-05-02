import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRETT;
if (!secretKey) throw new Error("Missing NEXT_PUBLIC_JWT_SECRET");

const encodedSecret = new TextEncoder().encode(secretKey);

export async function middleware(req: NextRequest) {
  console.log("🛡 Middleware running for:", req.nextUrl.pathname);
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  let isAuthenticated = false;
  let role: string | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, encodedSecret, {
        algorithms: ["HS256"],
      });
      isAuthenticated = true;
      role = payload.role as string; // ⬅️ Extract role from JWT payload
      console.log("✅ Authenticated as:", role);

      const response = NextResponse.next();
      response.cookies.set("role", role, {
        path: "/",
        httpOnly: false, // 🔓 so it’s readable by frontend JavaScript
        sameSite: "lax",
        maxAge: 60 * 15, // 15 minutes
      });
      return response;
    } catch (error) {
      console.error("❌ Invalid or expired JWT:", error);
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      response.cookies.delete("role"); // ⬅️ Clear role as well
      return response;
    }
  }

  // Allow access to login/register only for unauthenticated users
  if (pathname === "/login" || pathname === "/register") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Define access control per role
  const accessControl: Record<string, string[]> = {
    admin: ["/dashboard", "/inventory", "/sales", "/cash-balance", "/reports", "/settings", "/products", "/recipes"],
    cashier: ["/dashboard", "/sales", "/cash-balance"],
  };

  const isProtectedRoute = Object.values(accessControl).some((routes) => routes.some((route) => pathname.startsWith(route)));

  if (!isAuthenticated && isProtectedRoute) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("token");
    return response;
  }

  if (isAuthenticated && role !== "admin") {
    const allowedRoutes = accessControl[role || ""] || [];
    const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!hasAccess) {
      // 🔁 Redirect to a safe route not guarded by middleware
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*", "/inventory/:path*", "/sales/:path*", "/cash-balance/:path*", "/reports/:path*", "/settings/:path*", "/products/:path*", "/recipes/:path*"],
};
