"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/authSlice";

export default function LoginPage() {
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactNumber, password }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(
          setCredentials({ token: data.token, freelancer: data.freelancer })
        );
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("freelancer", JSON.stringify(data.freelancer));
        router.push("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1">Contact Number</label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <span className="text-gray-600">Don't have an account? </span>
            <a href="/register" className="text-blue-500 hover:underline">
              Register here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
