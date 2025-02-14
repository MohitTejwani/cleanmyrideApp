import FreelancerDropdown from "@/components/FreelancerDropdown";

export default function EditJobPage() {
  return (
    <form onSubmit={handleSubmit}>
      {/* ... other fields ... */}
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
      {/* ... existing code ... */}
    </form>
  );
}
