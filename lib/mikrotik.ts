import { RouterOSAPI } from "node-routeros";

export interface RouterConfig {
  ipAddress: string;
  username: string;
  password: string;
  port: number;
}

export interface HotspotUser {
  ".id": string;
  user?: string;
  name?: string;
  address?: string;
  "mac-address"?: string;
  [key: string]: unknown;
}

export interface ResetOptions {
  removeActive: boolean;
  removeCookies: boolean;
  removeMacBindings: boolean;
}

export interface ResetResult {
  success: boolean;
  operations: {
    activeRemoved: boolean;
    cookiesRemoved: boolean;
    macBindingsRemoved: boolean;
  };
  details: string[];
  error?: string;
}

/**
 * Connect to MikroTik router via API
 */
export async function connectToRouter(
  config: RouterConfig
): Promise<RouterOSAPI> {
  const conn = new RouterOSAPI({
    host: config.ipAddress,
    user: config.username,
    password: config.password,
    port: config.port,
    timeout: 10,
  });

  try {
    await conn.connect();
    return conn;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to connect to router: ${errorMessage}`);
  }
}

/**
 * Get all active hotspot users
 */
export async function getHotspotActiveUsers(
  conn: RouterOSAPI
): Promise<HotspotUser[]> {
  try {
    const data = await conn.write("/ip/hotspot/active/print");
    return data as HotspotUser[];
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get active users: ${errorMessage}`);
  }
}

/**
 * Remove user from hotspot active connections
 */
export async function removeActiveUser(
  conn: RouterOSAPI,
  username: string
): Promise<boolean> {
  try {
    // Get all active users
    const activeUsers = await conn.write("/ip/hotspot/active/print", [
      `?user=${username}`,
    ]);

    if (!activeUsers || activeUsers.length === 0) {
      return false; // User not found in active list
    }

    // Remove each active session for this user
    for (const user of activeUsers) {
      await conn.write("/ip/hotspot/active/remove", [`=.id=${user[".id"]}`]);
    }

    return true;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to remove active user: ${errorMessage}`);
  }
}

/**
 * Remove hotspot cookies for user
 */
export async function removeHotspotCookies(
  conn: RouterOSAPI,
  username: string
): Promise<boolean> {
  try {
    // Get all cookies for the user
    const cookies = await conn.write("/ip/hotspot/cookie/print", [
      `?user=${username}`,
    ]);

    if (!cookies || cookies.length === 0) {
      return false; // No cookies found
    }

    // Remove each cookie
    for (const cookie of cookies) {
      await conn.write("/ip/hotspot/cookie/remove", [`=.id=${cookie[".id"]}`]);
    }

    return true;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to remove cookies: ${errorMessage}`);
  }
}

/**
 * Remove MAC address bindings for user
 */
export async function removeUserMacBindings(
  conn: RouterOSAPI,
  username: string
): Promise<boolean> {
  try {
    // Get all IP bindings for the user
    const bindings = await conn.write("/ip/hotspot/ip-binding/print", [
      `?user=${username}`,
    ]);

    if (!bindings || bindings.length === 0) {
      return false; // No bindings found
    }

    // Remove each binding
    for (const binding of bindings) {
      await conn.write("/ip/hotspot/ip-binding/remove", [
        `=.id=${binding[".id"]}`,
      ]);
    }

    return true;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to remove MAC bindings: ${errorMessage}`);
  }
}

/**
 * Main function to reset hotspot user based on selected options
 */
export async function resetHotspotUser(
  config: RouterConfig,
  username: string,
  options: ResetOptions
): Promise<ResetResult> {
  let conn: RouterOSAPI | null = null;
  const result: ResetResult = {
    success: false,
    operations: {
      activeRemoved: false,
      cookiesRemoved: false,
      macBindingsRemoved: false,
    },
    details: [],
  };

  try {
    // Connect to router
    conn = await connectToRouter(config);
    result.details.push("✓ Connected to router successfully");

    // Remove from active connections
    if (options.removeActive) {
      try {
        const removed = await removeActiveUser(conn, username);
        result.operations.activeRemoved = true;
        result.details.push(
          removed
            ? `✓ Removed user from active connections`
            : `ℹ User not found in active connections`
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        result.details.push(`✗ Failed to remove from active: ${errorMessage}`);
      }
    }

    // Remove cookies
    if (options.removeCookies) {
      try {
        const removed = await removeHotspotCookies(conn, username);
        result.operations.cookiesRemoved = true;
        result.details.push(
          removed ? `✓ Removed hotspot cookies` : `ℹ No cookies found for user`
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        result.details.push(`✗ Failed to remove cookies: ${errorMessage}`);
      }
    }

    // Remove MAC bindings
    if (options.removeMacBindings) {
      try {
        const removed = await removeUserMacBindings(conn, username);
        result.operations.macBindingsRemoved = true;
        result.details.push(
          removed
            ? `✓ Removed MAC address bindings`
            : `ℹ No MAC bindings found for user`
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        result.details.push(`✗ Failed to remove MAC bindings: ${errorMessage}`);
      }
    }

    result.success = true;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.error = errorMessage;
    result.details.push(`✗ Error: ${errorMessage}`);
  } finally {
    // Close connection
    if (conn) {
      try {
        conn.close();
        result.details.push("✓ Connection closed");
      } catch {
        // Ignore close errors
      }
    }
  }

  return result;
}
