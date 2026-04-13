import { supabase } from "../lib/supabase";

// Fetches the full word list from Supabase, ordered by id so the app has a
// stable iteration order (matches the ids referenced in localStorage progress).
export async function fetchWords() {
  const { data, error } = await supabase
    .from("words")
    .select("id, english, indonesian")
    .order("id", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
