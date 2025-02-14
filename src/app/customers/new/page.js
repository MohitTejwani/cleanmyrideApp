"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: "",
    model: "",
    address: "",
    vehicleRegisterNo: "",
    customerName: "",
    contactNumber: "",
    remark: "",
    status: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName) newErrors.customerName = "Name is required";
    if (!formData.contactNumber)
      newErrors.contactNumber = "Contact is required";
    if (!formData.type) newErrors.type = "Vehicle type is required";
    if (!formData.model) newErrors.model = "Model is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.vehicleRegisterNo)
      newErrors.vehicleRegisterNo = "Register No is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/customers");
      } else {
        const data = await response.json();
        setErrors({ form: data.message || "Failed to create customer" });
      }
    } catch (err) {
      setErrors({ form: "An error occurred while creating customer" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Customer</h1>
      {errors.form && <div className="text-red-500 mb-4">{errors.form}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.customerName ? "border-red-500" : ""
              }`}
            />
            {errors.customerName && (
              <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.contactNumber ? "border-red-500" : ""
              }`}
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactNumber}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1">Vehicle Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.type ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Type</option>
              <option value="tata">Tata</option>
              <option value="honda">Honda</option>
              <option value="royal engine">Royal Engine</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type}</p>
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
            <label className="block mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.address ? "border-red-500" : ""
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>
          <div>
            <label className="block mb-1">Vehicle Register No</label>
            <input
              type="text"
              name="vehicleRegisterNo"
              value={formData.vehicleRegisterNo}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.vehicleRegisterNo ? "border-red-500" : ""
              }`}
            />
            {errors.vehicleRegisterNo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.vehicleRegisterNo}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1">Remark</label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
              className="mr-2"
            />
            <label>Active</label>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "Creating..." : "Create Customer"}
        </button>
      </form>
    </div>
  );
}
