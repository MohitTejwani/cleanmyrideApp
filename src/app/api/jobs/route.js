import { connectToDB } from "@/utils/database";
import Job from "@/models/job";

export const GET = async (request) => {
  try {
    await connectToDB();

    const jobs = await Job.find({})
      .populate("freelancerAssign", "name contactNumber")
      .exec();

    return new Response(JSON.stringify(jobs), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch jobs", { status: 500 });
  }
};
