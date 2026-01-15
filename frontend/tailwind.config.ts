import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // New premium color palette
                "deep-navy": {
                    DEFAULT: "#0C2C55",
                    50: "#E6EBF2",
                    100: "#CDD7E5",
                    200: "#9BAECB",
                    300: "#6986B1",
                    400: "#375D97",
                    500: "#0C2C55",
                    600: "#0A2344",
                    700: "#071A33",
                    800: "#051222",
                    900: "#020911",
                },
                "ocean-teal": {
                    DEFAULT: "#296374",
                    50: "#E8F2F4",
                    100: "#D1E5E9",
                    200: "#A3CBD3",
                    300: "#75B1BD",
                    400: "#4797A7",
                    500: "#296374",
                    600: "#214F5D",
                    700: "#193B46",
                    800: "#11282F",
                    900: "#081418",
                },
                "sky-blue": {
                    DEFAULT: "#629FAD",
                    50: "#EFF6F8",
                    100: "#DFEDF1",
                    200: "#BFDBE3",
                    300: "#9FC9D5",
                    400: "#7FB7C7",
                    500: "#629FAD",
                    600: "#4E7F8A",
                    700: "#3B5F68",
                    800: "#274045",
                    900: "#142023",
                },
                "cream": {
                    DEFAULT: "#EDEDCE",
                    50: "#FCFCF9",
                    100: "#F9F9F3",
                    200: "#F3F3E7",
                    300: "#EDEDCE",
                    400: "#E7E7B5",
                    500: "#E1E19C",
                    600: "#D4D46A",
                    700: "#C7C738",
                    800: "#9A9A2B",
                    900: "#6D6D1F",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-in-out",
                "fade-in-up": "fadeInUp 0.6s ease-out",
                "slide-in": "slideIn 0.4s ease-out",
                "slide-in-right": "slideInRight 0.4s ease-out",
                "scale-in": "scaleIn 0.3s ease-out",
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "shimmer": "shimmer 2s linear infinite",
                "glow": "glow 2s ease-in-out infinite",
                "float": "float 3s ease-in-out infinite",
                "bounce-subtle": "bounceSubtle 2s infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                fadeInUp: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideIn: {
                    "0%": { transform: "translateX(-100%)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
                slideInRight: {
                    "0%": { transform: "translateX(100%)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
                scaleIn: {
                    "0%": { transform: "scale(0.95)", opacity: "0" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-1000px 0" },
                    "100%": { backgroundPosition: "1000px 0" },
                },
                glow: {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(98, 159, 173, 0.5)" },
                    "50%": { boxShadow: "0 0 40px rgba(98, 159, 173, 0.8)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                bounceSubtle: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-5px)" },
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "shimmer-gradient": "linear-gradient(90deg, transparent, rgba(98, 159, 173, 0.3), transparent)",
            },
            boxShadow: {
                "glow-sm": "0 0 10px rgba(98, 159, 173, 0.3)",
                "glow-md": "0 0 20px rgba(98, 159, 173, 0.4)",
                "glow-lg": "0 0 30px rgba(98, 159, 173, 0.5)",
                "inner-glow": "inset 0 0 20px rgba(98, 159, 173, 0.2)",
            },
        },
    },
    plugins: [],
};

export default config;
