import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/site/login", request.url));
  }

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString());

    if (decoded.Role !== "Admin") {
      return NextResponse.redirect(new URL("/404", request.url));
    }
  } catch (err) {
    return NextResponse.redirect(new URL("/site/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
