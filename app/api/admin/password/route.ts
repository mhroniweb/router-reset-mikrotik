import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { adminPasswordSchema } from "@/lib/validators";
import { z } from "zod";

/**
 * PUT /api/admin/password
 * Update admin password
 *
 * This endpoint allows an authenticated admin to update their password.
 * It validates the current password before allowing the update.
 */
export async function PUT(req: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // Validate input with Zod
    const validatedData = adminPasswordSchema.parse({
      currentPassword,
      newPassword,
    });

    // Validate new password matches confirmation
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation do not match" },
        { status: 400 }
      );
    }

    // Validate new password is different from current
    if (validatedData.currentPassword === validatedData.newPassword) {
      return NextResponse.json(
        { error: "New password must be different from current password" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(
      validatedData.currentPassword
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Update password (the pre-save hook will hash it automatically)
    user.password = validatedData.newPassword;
    await user.save();

    return NextResponse.json({
      message: "Password updated successfully",
      success: true,
    });
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
    console.error("Password update error:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
