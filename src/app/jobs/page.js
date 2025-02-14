"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/job");
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Job Management</h1>
          <Link
            href="/jobs/new"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add New Job
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
                    Job ID
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
                    Contact Number
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
                    Freelancer
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300"></th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, inedex) => (
                  <tr key={job._id}>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {inedex + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {job?.customerDetails?.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {job?.customerDetails?.contactNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {job?.freelancerDetails?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {job.paymentStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
