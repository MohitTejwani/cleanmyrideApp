"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectCurrentToken } from "@/store/authSlice";
import Layout from "@/components/Layout";

// Mock data - replace with actual API calls
const vehicles = [
  {
    id: 1,
    model: "Toyota Camry",
    type: "Sedan",
    address: "123 Main St",
    timeEnd: "14:30",
  },
  {
    id: 2,
    model: "Ford F-150",
    type: "Truck",
    address: "456 Elm St",
    timeEnd: "15:00",
  },
  {
    id: 3,
    model: "Honda Civic",
    type: "Sedan",
    address: "789 Oak St",
    timeEnd: "16:00",
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleAccept = async (vehicleId) => {
    setIsLoading(true);
    try {
      // TODO: Implement accept logic
      console.log("Accepted vehicle:", vehicleId);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Redirect to vehicle details page
      window.location.href = `/vehicle/${vehicleId}`;
    } catch (error) {
      console.error("Error accepting request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async (vehicleId) => {
    setIsLoading(true);
    try {
      // TODO: Implement decline logic
      console.log("Declined vehicle:", vehicleId);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error declining request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null; // or a loading spinner while redirecting
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">CleanmyRide - Vehicle Requests</h1>
        </div>
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          </div>
        )}
        <div className="grid gap-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">{vehicle.model}</h2>
              <p className="text-gray-600">Type: {vehicle.type}</p>
              <p className="text-gray-600">Address: {vehicle.address}</p>
              <p className="text-gray-600">Time End: {vehicle.timeEnd}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleAccept(vehicle.id)}
                  disabled={isLoading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
                >
                  Accept Request
                </button>
                <button
                  onClick={() => handleDecline(vehicle.id)}
                  disabled={isLoading}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
                >
                  Decline Request
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
