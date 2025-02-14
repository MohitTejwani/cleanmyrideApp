import { connectToDB } from "@/utils/database";
import Job from "@/models/job";

export const PUT = async (request, { params }) => {
  const { customerName, contactNumber, freelancerAssign } =
    await request.json();

  try {
    await connectToDB();

    const updatedJob = await Job.findByIdAndUpdate(
      params.id,
      {
        customerName,
        contactNumber,
        freelancerAssign,
      },
      { new: true }
    );

    if (!updatedJob) {
      return new Response("Job not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedJob), { status: 200 });
  } catch (error) {
    return new Response("Failed to update job", { status: 500 });
  }
};
