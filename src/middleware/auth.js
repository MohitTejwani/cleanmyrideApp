import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Add user info to request
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("user-id", decoded.id);
  requestHeaders.set("contact-number", decoded.contactNumber);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/api/vehicle/:path*",
    "/dashboard/:path*",
    "/job/:path*",
    "/customer/:path*",
  ],
};
