"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import FreelancerDropdown from "@/components/FreelancerDropdown";

export default function NewJobPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerId: "",
    freelancerAssign: "",
    plan: "basic",
    status: "pending",
    paymentStatus: "pending",
    amount: 0,
    vehicleType: "",
    model: "",
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customer");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerId) newErrors.customerId = "Customer is required";
    if (!formData.plan) newErrors.plan = "Plan is required";
    if (!formData.amount) newErrors.amount = "Amount is required";
    if (!formData.vehicleType)
      newErrors.vehicleType = "Vehicle type is required";
    if (!formData.model) newErrors.model = "Model is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/jobs");
      } else {
        const data = await response.json();
        setErrors({ form: data.message || "Failed to create job" });
      }
    } catch (err) {
      setErrors({ form: "An error occurred while creating job" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Add New Job</h1>
        {errors.form && <div className="text-red-500 mb-4">{errors.form}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Customer</label>
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.customerId ? "border-red-500" : ""
                }`}
                required
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.customerName} - {customer.contactNumber}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="text-red-500 text-sm mt-1">{errors.customerId}</p>
              )}
            </div>

            <div>
              <label className="block mb-1">Plan</label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Vehicle Type</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.vehicleType ? "border-red-500" : ""
                }`}
                required
              >
                <option value="">Select Vehicle Type</option>
                <option value="honda">Honda</option>
                <option value="tata">Tata</option>
                <option value="royal engine">Royal Engine</option>
              </select>
              {errors.vehicleType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.vehicleType}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1">Model</label>
              <select
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.model ? "border-red-500" : ""
                }`}
                required
              >
                <option value="">Select Model</option>
                <option value="activa">Activa</option>
                <option value="150cc">150cc</option>
                <option value="classic 350">Classic 350</option>
              </select>
              {errors.model && (
                <p className="text-red-500 text-sm mt-1">{errors.model}</p>
              )}
            </div>

            <div>
              <label className="block mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${
                  errors.amount ? "border-red-500" : ""
                }`}
                required
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="issue">Issue</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Payment Status</label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Freelancer
              </label>
              <FreelancerDropdown
                value={formData.freelancerAssign}
                onChange={(e) =>
                  setFormData({ ...formData, freelancerAssign: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Creating..." : "Create Job"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
