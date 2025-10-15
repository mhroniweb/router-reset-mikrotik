import { z } from "zod";

/**
 * Router validation schema
 */
export const routerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),

  ipAddress: z.string(),
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username must be less than 50 characters")
    .trim(),

  password: z.string().min(4, "Password must be at least 4 characters"),

  port: z
    .number()
    .int("Port must be an integer")
    .min(1, "Port must be at least 1")
    .max(65535, "Port must be at most 65535")
    .default(8728),
});

/**
 * User reset validation schema
 */
export const resetUserSchema = z.object({
  routerId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid router ID"),

  username: z
    .string()
    .min(1, "Username is required")
    .max(100, "Username must be less than 100 characters")
    .trim(),

  removeActive: z.boolean().default(true),
  removeCookies: z.boolean().default(true),
  removeMacAddress: z.boolean().default(true),
});

/**
 * User validation schema
 */
export const userSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),

  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
});

/**
 * Admin password change schema
 */
export const adminPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});
