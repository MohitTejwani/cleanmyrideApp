import clientPromise from "@/lib/mongodb";

export const GET = async (request) => {
  try {
    const client = await clientPromise;
    const db = client.db("cleanmyride");
    const Job = db.collection("jobs");

    const jobs = await Job.find({})
      .populate("freelancerAssign", "name contactNumber")
      .exec();

    return new Response(JSON.stringify(jobs), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch jobs", { status: 500 });
  }
};
