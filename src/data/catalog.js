// Static catalog of supported languages and difficulty levels. The `code`
// values match the `language` / `level` columns in the Supabase `words` table.
// Entries flagged active=false render as "Coming soon" and aren't selectable.

export const LANGUAGES = [
  { code: "indonesian", short: "ID", name: "Indonesian", flag: "🇮🇩", active: true  },
  { code: "spanish",    short: "ES", name: "Spanish",    flag: "🇪🇸", active: false },
];

export const LEVELS = [
  {
    code: "beginner",
    name: "Beginner",
    description: "Everyday words and phrases",
    active: true,
  },
  {
    code: "intermediate",
    name: "Intermediate",
    description: "Broader vocabulary and common idioms",
    active: false,
  },
  {
    code: "advanced",
    name: "Advanced",
    description: "Nuanced expression and rarer words",
    active: false,
  },
  {
    code: "custom",
    name: "Custom",
    description: "Bring your own word list",
    active: false,
  },
];

export function getLanguage(code) {
  return LANGUAGES.find((l) => l.code === code) ?? null;
}

export function getLevel(code) {
  return LEVELS.find((l) => l.code === code) ?? null;
}
