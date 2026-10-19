import client from "./db.service";

export async function connectDB() {
  // Supabase client is initialized on import — connection is managed automatically.
  // This function is kept for drop-in compatibility with existing call sites.
  console.log("✅ Supabase client ready");
  return client;
}
