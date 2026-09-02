export const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Luna operational counters live in LunaTech's database, separate from Vigil/TrePro.
export const LUNA_SB_URL = process.env.NEXT_PUBLIC_LUNATECH_SUPABASE_URL || "";
export const LUNA_SB_KEY = process.env.NEXT_PUBLIC_LUNATECH_SUPABASE_ANON_KEY || "";

export const sbHeaders = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
};
