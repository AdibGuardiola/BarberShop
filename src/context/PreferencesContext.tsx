"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";
export type Language = "es" | "en";

const STORAGE_KEY = "barbershop-preferences";

type Preferences = {
  theme: Theme;
  language: Language;
};

type PreferencesContextValue = {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | undefined>(
  undefined,
);

function readPreferences(): Preferences | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as Preferences;
  } catch (err) {
    console.error("Error reading preferences", err);
    return null;
  }
}

function persistPreferences(value: Preferences) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (err) {
    console.error("Error saving preferences", err);
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";

    const stored = readPreferences();
    if (stored?.theme) return stored.theme;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "es";

    const stored = readPreferences();
    if (stored?.language) return stored.language;

    return "es";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language;
    document.documentElement.style.colorScheme = theme === "dark" ? "dark" : "light";

    persistPreferences({ theme, language });
  }, [theme, language]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      theme,
      language,
      toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
      toggleLanguage: () => setLanguage((prev) => (prev === "es" ? "en" : "es")),
      setTheme,
      setLanguage,
    }),
    [theme, language],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return ctx;
}
