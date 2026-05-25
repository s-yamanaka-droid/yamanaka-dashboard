export const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const sbHeaders = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
};
