import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("cleanmyride");

    // Test connection by listing collections
    const collections = await db.listCollections().toArray();

    return NextResponse.json(
      {
        success: true,
        collections: collections.map((c) => c.name),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
