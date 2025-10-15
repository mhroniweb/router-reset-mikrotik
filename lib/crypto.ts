import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

// Validate encryption key exists and is correct length
if (!ENCRYPTION_KEY) {
  throw new Error(
    "ENCRYPTION_KEY is not set. Please set it in your .env.local file. " +
      "Generate one with: openssl rand -hex 16"
  );
}

if (ENCRYPTION_KEY.length !== 32) {
  throw new Error(
    `ENCRYPTION_KEY must be exactly 32 characters long. Current length: ${ENCRYPTION_KEY.length}`
  );
}

const KEY_BUFFER = Buffer.from(ENCRYPTION_KEY, "utf-8");

/**
 * Encrypt text using AES-256-CBC
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY_BUFFER, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypt text using AES-256-CBC
 */
export function decrypt(text: string): string {
  const parts = text.split(":");

  if (parts.length !== 2) {
    throw new Error("Invalid encrypted data format");
  }

  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = parts[1];

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY_BUFFER, iv);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
