import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";

export async function POST(request) {
  try {
    const { name, contactNumber, password, profileImage } =
      await request.json();
    console.log("Registration request received:", { name, contactNumber });

    if (!name || !contactNumber || !password) {
      console.log("Missing required fields");
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("cleanmyride");
    const freelancersCollection = db.collection("freelancers");

    // Check if freelancer already exists
    const existingFreelancer = await freelancersCollection.findOne({
      contactNumber,
    });
    if (existingFreelancer) {
      console.log("Freelancer already exists:", contactNumber);
      return NextResponse.json(
        { message: "Freelancer already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Create new freelancer
    const newFreelancer = {
      name,
      contactNumber,
      password: hashedPassword,
      profileImage: profileImage || null,
      role: "freelancer",
      createdAt: new Date(),
      updatedAt: new Date(),
      status: true,
    };

    const result = await freelancersCollection.insertOne(newFreelancer);
    console.log("Freelancer created successfully:", result.insertedId);

    // Generate JWT token
    const token = generateToken({
      id: result.insertedId,
      contactNumber,
      role: "freelancer",
    });

    return NextResponse.json(
      {
        token,
        freelancer: {
          id: result.insertedId,
          name,
          contactNumber,
          role: "freelancer",
          profileImage: profileImage || null,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    console.log("Fetching freelancers");

    const client = await clientPromise;
    const db = client.db("cleanmyride");
    const freelancersCollection = db.collection("freelancers");

    const freelancers = await freelancersCollection
      .find({ role: "freelancer" })
      .project({
        password: 0, // Exclude password from results
      })
      .toArray();

    return NextResponse.json(freelancers);
  } catch (error) {
    console.error("Error fetching freelancers:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
