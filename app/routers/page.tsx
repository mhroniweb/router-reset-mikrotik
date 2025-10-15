"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import RouterForm from "@/components/RouterForm";
import RouterList from "@/components/RouterList";
import toast from "react-hot-toast";

interface Router {
  _id: string;
  name: string;
  ipAddress: string;
  username: string;
  port: number;
  createdAt: string;
}

export default function RoutersPage() {
  const router = useRouter();
  const [routers, setRouters] = useState<Router[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchRouters = async () => {
    try {
      const response = await fetch("/api/routers");

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch routers");
      }

      const data = await response.json();
      setRouters(data.routers);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRouters();
  }, []);

  const handleSuccess = () => {
    setShowForm(false);
    fetchRouters();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Router Management
            </h1>
            <p className="text-gray-600">
              Add and manage your MikroTik routers
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            {showForm ? "Cancel" : "+ Add Router"}
          </button>
        </div>

        {showForm && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add New Router
            </h2>
            <RouterForm onSuccess={handleSuccess} />
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Your Routers
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
              <p className="text-gray-600 mt-4">Loading routers...</p>
            </div>
          ) : (
            <RouterList
              routers={routers}
              onRouterDeleted={fetchRouters}
              onRouterUpdated={fetchRouters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
