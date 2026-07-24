import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";
type Language = "en" | "hi" | "es" | "fr";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [language, setLanguage] = useState<Language>("en");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.style.setProperty("--text-secondary", theme === "dark" ? "#CBD5E1" : "#1E293B");
      root.style.setProperty("--glass-border", theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)");
    } else {
      root.style.removeProperty("--text-secondary");
      root.style.removeProperty("--glass-border");
    }
  }, [highContrast, theme]);

  const toggleTheme = () => setThemeState((p) => (p === "dark" ? "light" : "dark"));
  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setTheme, language, setLanguage, reducedMotion, setReducedMotion, highContrast, setHighContrast }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
