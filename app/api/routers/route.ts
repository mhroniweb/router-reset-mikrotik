import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Router from "@/models/Router";
import { getSession } from "@/lib/auth";
import { routerSchema } from "@/lib/validators";
import { z } from "zod";

// GET - List all routers
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const routers = await Router.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json({ routers }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch routers";
    console.error("Error fetching routers:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST - Create a new router
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input with Zod
    const validatedData = routerSchema.parse(body);

    await connectDB();

    const router = await Router.create(validatedData);

    // Return without password
    const routerObj = router.toObject();
    delete routerObj.password;

    return NextResponse.json(
      { message: "Router added successfully", router: routerObj },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e: z.ZodIssue) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create router";
    console.error("Error creating router:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete a router
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Router ID is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const router = await Router.findByIdAndDelete(id);

    if (!router) {
      return NextResponse.json({ error: "Router not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Router deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete router";
    console.error("Error deleting router:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
