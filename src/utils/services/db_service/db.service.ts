import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Invalid/Missing environment variable: "NEXT_PUBLIC_SUPABASE_URL"');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Invalid/Missing environment variable: "NEXT_PUBLIC_SUPABASE_ANON_KEY"');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: ReturnType<typeof createClient>;

if (process.env.NODE_ENV === "development") {
  const globalWithSupabase = global as typeof globalThis & {
    _supabaseClient?: ReturnType<typeof createClient>;
  };

  if (!globalWithSupabase._supabaseClient) {
    globalWithSupabase._supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
  client = globalWithSupabase._supabaseClient;
} else {
  client = createClient(supabaseUrl, supabaseKey);
}

export default client;
