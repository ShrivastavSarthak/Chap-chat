import { v4 as uuidv4 } from "uuid";

/**
 * Service to generate a UUID version 4 (UUID4) string.
 * Uses Web Crypto API when available, falling back to uuid library.
 */
export function generateUUIDv4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return uuidv4();
}

export const createUUIDv4 = generateUUIDv4;
export const UUID4Service = generateUUIDv4;
export const getUUIDv4 = generateUUIDv4;
export default generateUUIDv4;
