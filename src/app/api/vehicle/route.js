import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("cleanmyride");
    const vehiclesCollection = db.collection("vehicles");

    const vehicles = await vehiclesCollection.find({}).toArray();

    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
