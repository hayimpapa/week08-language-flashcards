import { supabase } from "../lib/supabase";

// Fetches the word list for a given (language, level) from Supabase, ordered
// by id so the app has a stable iteration order (matches the ids referenced in
// localStorage progress).
export async function fetchWords(language, level) {
  const { data, error } = await supabase
    .from("words")
    .select("id, english, translation, language, level")
    .eq("language", language)
    .eq("level", level)
    .order("id", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
