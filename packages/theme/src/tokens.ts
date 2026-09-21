// Generated from apps/web/src/index.css by scripts/generate-tokens.ts.
// Do not edit by hand: run `bun run --filter @global-theme generate` instead.

/** Web's oklch palette converted to sRGB hex that React Native can parse. */
export const colors = {
    background: "#ffffff",
    foreground: "#0a0a0a",
    card: "#ffffff",
    cardForeground: "#0a0a0a",
    popover: "#ffffff",
    popoverForeground: "#0a0a0a",
    primary: "#171717",
    primaryForeground: "#fafafa",
    secondary: "#f5f5f5",
    secondaryForeground: "#171717",
    muted: "#f5f5f5",
    mutedForeground: "#737373",
    accent: "#f5f5f5",
    accentForeground: "#171717",
    destructive: "#e7000b",
    border: "#e5e5e5",
    input: "#e5e5e5",
    ring: "#a1a1a1",
} as const;

export type ColorToken = keyof typeof colors;

/** Web's radius scale in points, matching Tailwind's `rounded-*` sizes. */
export const radius = {
    sm: 6,
    md: 8,
    lg: 10,
    xl: 14,
    "2xl": 18,
    "3xl": 22,
    "4xl": 26,
} as const;

export type RadiusToken = keyof typeof radius;
