import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("cleanmyride");
    const customer = await db.collection("customers").findOne({
      _id: new ObjectId(params.id),
    });

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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
    const result = await db.collection("customers").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          type,
          model,
          address,
          vehicleRegisterNo,
          customerName,
          contactNumber,
          remark,
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Customer updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
