import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: "system",
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(() => {
        // Check if we're in the browser environment
        if (typeof window === "undefined") {
            return defaultTheme;
        }
        
        // Try to get theme from localStorage first
        try {
            const storedTheme = localStorage.getItem(storageKey) as Theme;
            if (storedTheme && (storedTheme === "dark" || storedTheme === "light" || storedTheme === "system")) {
                return storedTheme;
            }
        } catch (error) {
            console.warn("Failed to read theme from localStorage:", error);
        }
        
        return defaultTheme;
    });

    useEffect(() => {
        // Only run on client side
        if (typeof window === "undefined") return;

        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? "dark"
                : "light";

            root.classList.add(systemTheme);
            return;
        }

        root.classList.add(theme);
        
        // Save to localStorage whenever theme changes
        try {
            localStorage.setItem(storageKey, theme);
        } catch (error) {
            console.warn("Failed to save theme to localStorage:", error);
        }
    }, [theme, storageKey]);

    const value = {
        theme,
        setTheme: (newTheme: Theme) => {
            // Save to localStorage immediately when theme is set
            if (typeof window !== "undefined") {
                try {
                    localStorage.setItem(storageKey, newTheme);
                } catch (error) {
                    console.warn("Failed to save theme to localStorage:", error);
                }
            }
            setTheme(newTheme);
        },
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};