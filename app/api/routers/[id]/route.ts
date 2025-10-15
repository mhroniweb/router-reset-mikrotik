import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Router from "@/models/Router";
import { getSession } from "@/lib/auth";
import { routerSchema } from "@/lib/validators";
import { z } from "zod";

// GET - Get router by ID (without password for security)
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
    await connectDB();

    const router = await Router.findById(id).select("-password");

    if (!router) {
      return NextResponse.json({ error: "Router not found" }, { status: 404 });
    }

    return NextResponse.json({ router }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch router";
    console.error("Error fetching router:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT - Update router
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // For updates, make password optional
    // Remove password from validation if it's empty or only whitespace
    if (typeof body.password === "string" && body.password.trim() === "") {
      delete body.password;
    }
    // Validate with password optional
    const updateSchema = routerSchema.partial({ password: true });
    const validatedData = updateSchema.parse(body);


    await connectDB();

    const router = await Router.findById(id);

    if (!router) {
      return NextResponse.json({ error: "Router not found" }, { status: 404 });
    }

    // Update fields
    router.name = validatedData.name;
    router.ipAddress = validatedData.ipAddress;
    router.username = validatedData.username;
    router.port = validatedData.port;

    // Only update password if provided
    if (validatedData.password && validatedData.password.trim() !== "") {
      router.password = validatedData.password; // Will be encrypted by pre-save hook
    }

    await router.save();

    // Return without password
    const routerObj = router.toObject();
    delete routerObj.password;

    return NextResponse.json(
      { message: "Router updated successfully", router: routerObj },
      { status: 200 }
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
      error instanceof Error ? error.message : "Failed to update router";
    console.error("Error updating router:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
