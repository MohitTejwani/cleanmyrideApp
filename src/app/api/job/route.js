import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("cleanmyride");

    const jobs = await db
      .collection("jobs")
      .aggregate([
        {
          $lookup: {
            from: "freelancers",
            localField: "freelancerAssign",
            foreignField: "_id",
            as: "freelancerDetails",
            pipeline: [
              {
                $project: {
                  name: 1,
                  contactNumber: 1,
                  _id: 0,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "customerId",
            foreignField: "_id",
            as: "customerDetails",
            pipeline: [
              {
                $project: {
                  customerName: 1,
                  contactNumber: 1,
                  _id: 0,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$freelancerDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$customerDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();

    return NextResponse.json(jobs);
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
      customerId,
      freelancerAssign,
      plan,
      status,
      paymentStatus,
      amount,
      vehicleType,
      model,
    } = await request.json();

    const client = await clientPromise;
    const db = client.db("cleanmyride");
    const result = await db.collection("jobs").insertOne({
      customerId: new ObjectId(customerId),
      freelancerAssign: freelancerAssign
        ? new ObjectId(freelancerAssign)
        : null,
      plan,
      status: status || "pending",
      paymentStatus: paymentStatus || "pending",
      amount,
      vehicleType,
      model,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Job created", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
