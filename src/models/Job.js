import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  customerName: { type: String },
  contactNumber: { type: String },
  freelancerAssign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Freelancer",
  },
});

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;
