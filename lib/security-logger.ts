/**
 * Security event logging system
 * Logs security-sensitive events for audit trails
 */

export interface SecurityEvent {
  event: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  severity: "info" | "warning" | "critical";
}

/**
 * Log a security event
 * In production, this should be sent to a logging service (Datadog, Sentry, etc.)
 */
export function logSecurityEvent(event: SecurityEvent): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...event,
  };

  // In production, send to logging service
  if (process.env.NODE_ENV === "production") {
    // JSON format for easy parsing by log aggregation tools
    console.log("[SECURITY]", JSON.stringify(logEntry));

    // TODO: Send to external logging service
    // Example:
    // await sendToDatadog(logEntry);
    // await sendToSentry(logEntry);
  } else {
    // In development, use readable format
    console.log("[SECURITY]", logEntry);
  }
}

/**
 * Helper to get client IP from request
 * Handles various proxy headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip"); // Cloudflare

  return (
    cfConnectingIp || forwarded?.split(",")[0].trim() || realIp || "unknown"
  );
}

/**
 * Helper to get user agent from request
 */
export function getUserAgent(req: Request): string {
  return req.headers.get("user-agent") || "unknown";
}

/**
 * Predefined security event types for consistency
 */
export const SecurityEventType = {
  // Authentication events
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGIN_RATE_LIMIT: "LOGIN_RATE_LIMIT_EXCEEDED",
  LOGOUT: "LOGOUT",

  // Password events
  PASSWORD_CHANGE_SUCCESS: "PASSWORD_CHANGE_SUCCESS",
  PASSWORD_CHANGE_FAILURE: "PASSWORD_CHANGE_FAILURE",

  // Router operations
  ROUTER_CREATED: "ROUTER_CREATED",
  ROUTER_UPDATED: "ROUTER_UPDATED",
  ROUTER_DELETED: "ROUTER_DELETED",
  ROUTER_PASSWORD_ACCESSED: "ROUTER_PASSWORD_ACCESSED",

  // User reset operations
  USER_RESET_SUCCESS: "USER_RESET_SUCCESS",
  USER_RESET_FAILURE: "USER_RESET_FAILURE",

  // Security violations
  UNAUTHORIZED_ACCESS_ATTEMPT: "UNAUTHORIZED_ACCESS_ATTEMPT",
  INVALID_ROUTER_ACCESS_ATTEMPT: "INVALID_ROUTER_ACCESS_ATTEMPT",
  CSRF_ATTEMPT: "CSRF_ATTEMPT",
  VALIDATION_ERROR: "VALIDATION_ERROR",
} as const;
