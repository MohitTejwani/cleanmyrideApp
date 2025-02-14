import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("cleanmyride");
    const customers = await db.collection("customers").find({}).toArray();
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const {
      type,
      model,
      address,
      vehicleRegisterNo,
      customerName,
      contactNumber,
      remark,
      status,
    } = await request.json();

    const client = await clientPromise;
    const db = client.db("cleanmyride");
    const result = await db.collection("customers").insertOne({
      type,
      model,
      address,
      vehicleRegisterNo,
      customerName,
      contactNumber,
      remark,
      status: status || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Customer created", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
