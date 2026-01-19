/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      boxShadow: {
        "mat-flat":
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
        "mat-hover":
          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        "mat-base":
          "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
        "3d-hover":
          "rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset",
        "step-hover":
          "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
        // Neo-Victorian / Cyber-Noir Shadows
        "tactile-sm": "0px 2px 0px 0px rgba(255,255,255,0.1)",
        "tactile-md": "0px 4px 0px 0px rgba(255,255,255,0.1)",
        "tactile-lg": "0px 6px 0px 0px rgba(255,255,255,0.1)", // Added for hover state mentioned in specs
        "tactile-active": "0px 0px 0px 0px rgba(255,255,255,0.1)",
        "neon-glow":
          "0 0 10px theme('colors.cyber.neon'), 0 0 20px theme('colors.cyber.neon')",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      backgroundImage: {
        "purple-gradient-r":
          "linear-gradient(to right, rgba(167, 139, 250, 0.05), rgba(236, 72, 153, 0.05), rgba(239, 68, 68, 0.05))",
        "purple-gradient-l":
          "linear-gradient(to left, rgba(167, 139, 250, 0.05), rgba(236, 72, 153, 0.05), rgba(239, 68, 68, 0.05))",
        "purple-gradient-r-10":
          "linear-gradient(to right, rgba(167, 139, 250, 0.1), rgba(236, 72, 153, 0.1), rgba(239, 68, 68, 0.1))",
        "purple-gradient-l-10":
          "linear-gradient(to left, rgba(167, 139, 250, 0.1), rgba(236, 72, 153, 0.1), rgba(239, 68, 68, 0.1))",
        "purple-gradient-r-20":
          "linear-gradient(to right, rgba(167, 139, 250, 0.2), rgba(236, 72, 153, 0.2), rgba(239, 68, 68, 0.2))",
        "purple-gradient-l-20":
          "linear-gradient(to left, rgba(167, 139, 250, 0.2), rgba(236, 72, 153, 0.2), rgba(239, 68, 68, 0.2))",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Cyber Accents (WCAG AA compliant on dark backgrounds)
        cyber: {
          neon: "#FF7F40", // Main Action / Success (Brighter Neon Orange)
          pink: "#FF66FF", // Highlights / "Delight" (Brighter Pink)
          cyan: "#5CE1E6", // Links / Information (Accessible Cyan)
          warning: "#FFD93D", // Warnings (Brighter Gold)
          error: "#FF6B6B", // Errors (Coral Red)
        },
        // Glass Surfaces
        glass: {
          low: "rgba(255, 255, 255, 0.05)",
          medium: "rgba(255, 255, 255, 0.1)",
          high: "rgba(255, 255, 255, 0.2)",
          border: "rgba(255, 255, 255, 0.15)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      blur: {
        "3xl": "64px",
        "4xl": "96px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "blob-slow": "blob 7s infinite",
      },
      zIndex: {
        "-10": "-10",
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
