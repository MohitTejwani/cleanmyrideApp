import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";

export async function POST(request) {
  try {
    const { contactNumber, password } = await request.json();

    if (!contactNumber || !password) {
      return NextResponse.json(
        { message: "Contact number and password are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("cleanmyride");
    const freelancersCollection = db.collection("freelancers");

    // Find freelancer by contact number
    const freelancer = await freelancersCollection.findOne({ contactNumber });
    if (!freelancer) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, freelancer.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      id: freelancer._id,
      contactNumber: freelancer.contactNumber,
      role: freelancer.role,
    });

    return NextResponse.json(
      {
        token,
        freelancer: {
          id: freelancer._id,
          name: freelancer.name,
          contactNumber: freelancer.contactNumber,
          role: freelancer.role,
          profileImage: freelancer.profileImage,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
