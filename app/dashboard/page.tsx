import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import Router from "@/models/Router";
import Navbar from "@/components/Navbar";
import UserResetForm from "@/components/UserResetForm";
import { Types } from "mongoose";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const routers = await Router.find({})
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  // Convert MongoDB objects to plain objects
  const plainRouters = routers.map((router) => ({
    _id: (router._id as Types.ObjectId).toString(),
    name: router.name as string,
    ipAddress: router.ipAddress as string,
    username: router.username as string,
    port: router.port as number,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Reset MikroTik hotspot users</p>
        </div>

        <UserResetForm routers={plainRouters} />

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            ℹ How it works
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Select the router you want to manage</li>
            <li>• Enter the hotspot username you want to reset</li>
            <li>
              • Choose which operations to perform (all selected by default)
            </li>
            <li>• Click &quot;Reset User&quot; to execute the operation</li>
            <li>
              • The system will remove the user from selected lists on your
              MikroTik router
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
