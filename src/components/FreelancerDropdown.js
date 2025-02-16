"use client";
import { useEffect, useState } from "react";

const FreelancerDropdown = ({ value, onChange }) => {
  const [freelancers, setFreelancers] = useState([]);

  useEffect(() => {
    const fetchFreelancers = async () => {
      const response = await fetch("/api/freelancer");
      const data = await response.json();
      console.log(data);

      setFreelancers(data);
    };

    fetchFreelancers();
  }, []);

  return (
    <select
      value={value}
      onChange={onChange}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    >
      <option value="">Select Freelancer</option>
      {freelancers.length &&
        freelancers.map((freelancer) => (
          <option key={freelancer._id} value={freelancer._id}>
            {freelancer.name} - {freelancer.contactNumber}
          </option>
        ))}
    </select>
  );
};

export default FreelancerDropdown;
