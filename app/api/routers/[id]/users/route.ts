import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Router from "@/models/Router";
import { getSession } from "@/lib/auth";
import {
  connectToRouter,
  getHotspotActiveUsers,
  HotspotUser,
} from "@/lib/mikrotik";

// GET - Fetch hotspot users from a specific router
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    await connectDB();

    // Fetch router with password
    const router = await Router.findById(id);

    if (!router) {
      return NextResponse.json({ error: "Router not found" }, { status: 404 });
    }

    // Decrypt password for connection
    const decryptedPassword = router.getDecryptedPassword();

    const routerConfig = {
      ipAddress: router.ipAddress,
      username: router.username,
      password: decryptedPassword,
      port: router.port,
    };

    // Connect to router and get active users
    const conn = await connectToRouter(routerConfig);
    const activeUsers = await getHotspotActiveUsers(conn);
    conn.close();
    activeUsers.forEach((user: HotspotUser) => {
      if (user.user === "52898322") {
        console.log("user==============>", user);
      }
    });

    // Extract unique usernames
    const usernames = Array.from(
      new Set(
        activeUsers
          .map((user: HotspotUser) => user.user || user.name)
          .filter(Boolean)
      )
    ) as string[];

    // Filter by search term if provided
    const filteredUsers = search
      ? usernames.filter((username) =>
          username.toLowerCase().includes(search.toLowerCase())
        )
      : usernames;

    return NextResponse.json(
      { users: filteredUsers.slice(0, 10) },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
