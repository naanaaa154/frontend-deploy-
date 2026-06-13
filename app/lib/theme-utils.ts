// Feature-specific theme utilities
// Use this file to override colors for specific features

export const featureThemes = {
  notes: {
    primary: "hsl(142 76% 36%)", // Green
    secondary: "hsl(142 76% 92%)",
    accent: "hsl(142 76% 20%)",
  },
  voice: {
    primary: "hsl(221 83% 53%)", // Blue
    secondary: "hsl(221 83% 92%)",
    accent: "hsl(221 83% 20%)",
  },
  ai: {
    primary: "hsl(271 81% 56%)", // Purple
    secondary: "hsl(271 81% 92%)",
    accent: "hsl(271 81% 20%)",
  },
  auth: {
    primary: "hsl(346 87% 43%)", // Red
    secondary: "hsl(346 87% 92%)",
    accent: "hsl(346 87% 20%)",
  },
};

export const applyFeatureTheme = (feature: keyof typeof featureThemes) => {
  const theme = featureThemes[feature];
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--accent", theme.accent);
  }
};

export const resetTheme = () => {
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    root.style.removeProperty("--primary");
    root.style.removeProperty("--secondary");
    root.style.removeProperty("--accent");
  }
};