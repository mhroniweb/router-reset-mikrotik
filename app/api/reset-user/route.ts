import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Router from "@/models/Router";
import { getSession } from "@/lib/auth";
import { resetHotspotUser, ResetOptions } from "@/lib/mikrotik";
import { resetUserSchema } from "@/lib/validators";
import { z } from "zod";
import {
  logSecurityEvent,
  SecurityEventType,
  getClientIp,
} from "@/lib/security-logger";
import { IUser } from "@/models/User";

// POST - Reset hotspot user
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate input with Zod
    const validatedData = resetUserSchema.parse(body);

    await connectDB();

    // Fetch router with password
    const router = await Router.findById(validatedData.routerId);

    if (!router) {
      logSecurityEvent({
        event: SecurityEventType.INVALID_ROUTER_ACCESS_ATTEMPT,
        userId: (session.user as IUser).id,
        ipAddress: getClientIp(req),
        details: { routerId: validatedData.routerId },
        severity: "warning",
      });
      return NextResponse.json({ error: "Router not found" }, { status: 404 });
    }

    // Log password access
    logSecurityEvent({
      event: SecurityEventType.ROUTER_PASSWORD_ACCESSED,
      userId: (session.user as IUser).id,
      ipAddress: getClientIp(req),
      details: {
        routerId: router._id.toString(),
        routerName: router.name,
        username: validatedData.username,
      },
      severity: "info",
    });

    // Decrypt password for connection
    const decryptedPassword = router.getDecryptedPassword();

    const routerConfig = {
      ipAddress: router.ipAddress,
      username: router.username,
      password: decryptedPassword,
      port: router.port,
    };

    const options: ResetOptions = {
      removeActive: validatedData.removeActive,
      removeCookies: validatedData.removeCookies,
      removeMacBindings: validatedData.removeMacBindings,
    };

    // Execute reset operation
    const result = await resetHotspotUser(
      routerConfig,
      validatedData.username,
      options
    );

    if (result.success) {
      logSecurityEvent({
        event: SecurityEventType.USER_RESET_SUCCESS,
        userId: (session.user as IUser).id,
        ipAddress: getClientIp(req),
        details: {
          routerId: router._id.toString(),
          routerName: router.name,
          username: validatedData.username,
          options,
        },
        severity: "info",
      });
      return NextResponse.json(
        {
          message: "User reset operation completed",
          result,
        },
        { status: 200 }
      );
    } else {
      logSecurityEvent({
        event: SecurityEventType.USER_RESET_FAILURE,
        userId: (session.user as IUser).id,
        ipAddress: getClientIp(req),
        details: {
          routerId: router._id.toString(),
          routerName: router.name,
          username: validatedData.username,
          error: result.error,
        },
        severity: "warning",
      });
      return NextResponse.json(
        {
          error: "Reset operation failed",
          result,
        },
        { status: 500 }
      );
    }
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
    console.error("Error resetting user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to reset user";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
