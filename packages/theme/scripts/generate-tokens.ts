import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { formatHex, formatHex8, parse } from "culori";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const cssPath = fileURLToPath(
    new URL("../../../apps/web/src/index.css", import.meta.url),
);
const outputPath = `${packageRoot}src/tokens.ts`;

const css = readFileSync(cssPath, "utf8");

function block(selector: string): string {
    const match = css.match(new RegExp(`${selector}\\s*\\{([^}]*)\\}`));
    if (!match) {
        throw new Error(`Could not find "${selector}" in ${cssPath}`);
    }
    return match[1];
}

function camelCase(token: string): string {
    return token.replace(/-([a-z])/g, (_, letter: string) =>
        letter.toUpperCase(),
    );
}

function toHex(value: string): string {
    const color = parse(value);
    if (!color) {
        throw new Error(`culori could not parse "${value}"`);
    }
    const hex =
        color.alpha === undefined || color.alpha === 1
            ? formatHex(color)
            : formatHex8(color);
    if (!hex) {
        throw new Error(`culori could not convert "${value}" to hex`);
    }
    return hex;
}

const root = block(":root");

const colors = [...root.matchAll(/--([\w-]+):\s*(oklch\([^;]+\));/g)].map(
    ([, token, value]) => [camelCase(token), toHex(value)] as const,
);

if (colors.length === 0) {
    throw new Error(`No oklch tokens found in ${cssPath}`);
}

// The web radius scale lives in `@theme inline` as multipliers of `--radius`,
// so the native values stay in sync by reading both halves.
const baseRadius = root.match(/--radius:\s*([\d.]+)rem;/);
if (!baseRadius) {
    throw new Error(`No --radius declaration found in ${cssPath}`);
}
const baseRadiusPx = Number(baseRadius[1]) * 16;

const radius = [
    ...block("@theme inline").matchAll(
        /--radius-([\w]+):\s*(?:calc\(var\(--radius\)\s*\*\s*([\d.]+)\)|var\(--radius\))/g,
    ),
].map(([, name, multiplier]) => {
    const key = /^[a-z][\w$]*$/i.test(name) ? name : `"${name}"`;
    return [key, Math.round(baseRadiusPx * Number(multiplier ?? 1))] as const;
});

function entries(pairs: readonly (readonly [string, string | number])[]) {
    return pairs
        .map(
            ([key, value]) =>
                `    ${key}: ${typeof value === "string" ? `"${value}"` : value},`,
        )
        .join("\n");
}

const file = `// Generated from apps/web/src/index.css by scripts/generate-tokens.ts.
// Do not edit by hand: run \`bun run --filter @global-theme generate\` instead.

/** Web's oklch palette converted to sRGB hex that React Native can parse. */
export const colors = {
${entries(colors)}
} as const;

export type ColorToken = keyof typeof colors;

/** Web's radius scale in points, matching Tailwind's \`rounded-*\` sizes. */
export const radius = {
${entries(radius)}
} as const;

export type RadiusToken = keyof typeof radius;
`;

writeFileSync(outputPath, file);

console.log(
    `Wrote ${colors.length} colors and ${radius.length} radii to ${outputPath}`,
);
