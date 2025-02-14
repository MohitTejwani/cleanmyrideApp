import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    // Fetch user data from database using decoded.id
    const user = await getUserById(decoded.id);

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
