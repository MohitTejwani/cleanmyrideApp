"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials, logout } from "@/store/authSlice";

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const freelancer = useSelector((state) => state.auth.freelancer);

  // Check for token on mount
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else if (!freelancer) {
      // If token exists but no freelancer data, fetch user data
      fetchUserData(token);
    }
  }, [router, freelancer]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      dispatch(setCredentials({ token, freelancer: data }));
    } catch (error) {
      handleLogout();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    dispatch(logout());
    router.push("/login");
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Get freelancer data from Redux
  const profileImage = freelancer?.profileImage
    ? freelancer.profileImage
    : "/profile.jpg";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleMenu}
            className="md:hidden mr-2 text-gray-700 hover:text-gray-900"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <div className="flex items-center">
            <img
              src="/logo.png" // Add your logo in public folder
              alt="CleanMyRide Logo"
              className="h-8 w-8 mr-2"
            />
            <h1 className="text-xl font-bold text-gray-800">CleanMyRide</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Side Menu */}
        <aside
          className={`fixed md:static inset-y-0 left-0 transform ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-200 ease-in-out bg-white w-64 border-r z-40`}
        >
          <div className="p-4">
            {/* Profile Section */}
            <div className="flex items-center mb-6">
              <img
                src={profileImage}
                alt="Profile"
                className="h-10 w-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium">{freelancer?.name}</p>
                <p className="text-sm text-gray-500">
                  {freelancer?.contactNumber}
                </p>
                <p className="text-sm text-gray-500">{freelancer?.role}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <Link
                href="/"
                onClick={closeMenu}
                className="block p-2 hover:bg-gray-100 rounded"
              >
                Home
              </Link>
              <Link
                href="/jobs"
                onClick={closeMenu}
                className="block p-2 hover:bg-gray-100 rounded"
              >
                Jobs
              </Link>
              <Link
                href="/customers"
                onClick={closeMenu}
                className="block p-2 hover:bg-gray-100 rounded"
              >
                Customer
              </Link>
            </nav>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full mt-6 p-2 text-left hover:bg-gray-100 rounded"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={closeMenu}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
