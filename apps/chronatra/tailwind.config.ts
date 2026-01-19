import type { Config } from "tailwindcss";
import sharedConfig from "@repo/ui/tailwind-preset";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{tsx,ts}" 
  ],
  presets: [sharedConfig],
};

export default config;
